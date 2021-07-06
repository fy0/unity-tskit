import { action, makeObservable, observable } from "mobx";
import { GameModule } from "../base/game-module";

/** 物品类型 */
export enum ItemType {
	/** 全部 */
	ALL = 'all',

	/** 货币 1xxx */
	MONEY = 'money',

	/** 矿物 2xxx */
	MINERAL = 'mineral',

	/** 矿物 3xxx */
	RELIC = 'relic',

	/** 消耗品 16xxx */
	CONSUME = 'consume',

	/** 其它 17xxx */
	OTHERS = 'others',

	/** 隐藏 9xxx */
	HIDE = 'hide'
}

/** 物品 */
export interface IItem {
	/** 物品ID */
	id: number;
	/** 名称 */
	title: string;
	/** 物品类型 */
	type: ItemType;
	/** 持有上限 */
	limit?: number;
	/** 说明 */
	desc?: string;
	/** name, 自动生成 */
	name?: string;
	extra?: any;
}

/**
 * 添加一种货币 / 物品流程：
 * 1. 在 ITEM_NAME 中写一个枚举
 * 2. items中写一条描述
 * 3. 提交给后端，服务器加上对应校验
 *
 * 请注意：物品会按照ID排序，慎重对待ID号
 */
export const Items = {
	'cash': {
		id: 1001,
		title: '现金',
		type: ItemType.MONEY,
	},
	'repute': {
		id: 1002,
		title: '声望',
		type: ItemType.MONEY,
	},

	// 金子，可以兑换现金，1:10
	'gold': {
		id: 2001,
		title: '金矿石',
		type: ItemType.MINERAL,
	},

	// 遗物，可以兑换现金，或者展览用于增加声望
	'relic1': {
		id: 3001,
		title: 'Ancient currency', //古代货币
		type: ItemType.RELIC,
		extra: {
			cash: 10,
			repute: 1
		},

	},
	'relic2': {
		id: 3002,
		title: 'Statue', // 维纳斯
		type: ItemType.RELIC,
		extra: {
			cash: 20,
			repute: 2
		},
	},
	'relic3': {
		id: 3003,
		// title: '生物化石',
		title: 'Fossil',
		type: ItemType.RELIC,
		extra: {
			cash: 30,
			repute: 2
		},
	},

	// 挖矿科技，只影响矿物 [矿工]
	'tech_mine': {
		id: 9001,
		title: '科技：挖矿',
		type: ItemType.HIDE,
	},

	// 工程科技，能让小车出问题概率下降 [工程师]
	'tech_craft': {
		id: 9002,
		title: '科技：工程',
		type: ItemType.HIDE,
	},

};

export const ITEM_BY_ID: Record<number, IItem> = {};

for (let [k, v] of Object.entries(Items)) {
	(v as IItem).name = k;
	ITEM_BY_ID[v.id] = v;
}

interface ISaveData {
	[key: string]: number;
}


/**
 * 物品栏
 * 玩家的货币同样视为物品 // extends Record<keyof typeof Items, IItem>
 */
export class Inventory<T = typeof Items> extends GameModule {
	@observable
	private points: Record<keyof T, number>;

	/**
	 * 获取物品数量
	 * 注：经测试这个方法可以触发变量监听，同时不会导致过量更新（points中一个值改变，对其余值的监听不会再触发一次更新）
	 * @param type 物品类型
	 * @returns
	 */
	get<K extends keyof T>(type: K): number {
		return this.points[type as K] || 0;
	}

	getById<K extends keyof T>(id: number): number {
		return this.get(ITEM_BY_ID[id].name as K);
	}

	/** 自带弹出提示的版本 */
	async tryCost(costs: Partial<Record<keyof T, number>>, payPoint = null): Promise<boolean> {
		if (this.canCost(costs)) {
			return this.cost(costs, payPoint);
		}
		return false;
	}

	/** 自带弹出提示的版本 */
	tryEarn() { }

	/** 检查物品否充足，可填入多项 */
	canCost(costs: Partial<Record<keyof T, number>>): boolean {
		for (const type of Object.keys(costs)) {
			if (this.points[type] < costs[type]) return false;
		}
		return true;
	}

	/**
	 * 使用物品
	 * 建议使用 Game.getModule(Inventory).cost({ [ITEM_NAME.COIN]: 1 }); 因为能点进来看到注释
	 * 也可以使用 Game.getModule(Inventory).cost({ 'coin': 1 });
	 * @param costs 要使用的物品列表，支持一次性使用多种货币。
	 * @returns
	 */
	@action
	async cost(costs: Partial<Record<keyof T, number>>, payPoint = null): Promise<boolean> {
		// 请注意，这个函数不检查货币是否足够，在这之前应该先做好判断

		for (const type of Object.keys(costs)) {
			let value = costs[type];
			if (value < 0) value = 0;
			(this.points as Record<string, number>)[type] -= value;
		}

		return true;
	}

	canEarn(earns: Partial<Record<keyof T, number>>): boolean {
		for (const type of Object.keys(earns)) {
			if (Items[type].limit !== null) {
				if ((this.points[type] || 0) + earns[type] > Items[type].limit) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * 获得物品
	 * @param earns
	 * @param rewardPoint
	 */
	@action
	earn(earns: Partial<Record<keyof T, number>>, rewardPoint =null): boolean {
		// 临时方案：直接增加数量，然后保存
		for (const type of Object.keys(earns)) {
			let value = earns[type];
			if (value < 0) value = 0;
			const points = (this.points as Record<string, number>);
			if (!points[type]) points[type] = 0;
			points[type] += value;
		}
		return true;
	}

	// 支付兼容
	pay = this.cost;
	canPay = this.canCost;

	/** 返回指定类型的物品列表，按ID顺序排列 （未来做仓库的时候用）*/
	getAllItems(type: ItemType) {
	}

	/** 向服务器做请求，更新数据 */
	async sync() {
		;
	}

	save(): ISaveData {
		return this.points;
	}

	load(data: ISaveData) {
		Object.assign(this.points, data);
		const points = this.points;
	}

	init() {
		this.points = {} as Record<keyof T, number>;
		for (const [k, v] of Object.entries(Items)) {
			this.points[v as any] = 0;
		}
		(this.points as any).cash = 100;
		(this.points as any).repute = 0;
		makeObservable(this);
	}
}
