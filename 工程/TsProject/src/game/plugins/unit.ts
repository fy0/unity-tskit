import { Attribute } from './attr';
import { Buff, BuffState } from './buff';
import { when, makeAutoObservable, computed, makeObservable, observable, IObservableArray } from 'mobx';
import { SObject } from '../../core/object';
import { Emitter } from '../../core/event';
import { UnitAttack } from './attack';
import { Action } from './action';
import { arrayAdded, arrayRemoved } from 'mobx-collection-watch';

export enum FriendFlag {
  Player = 2 << 0,
  Friend1 = 2 << 1,
  Friend2 = 2 << 2,
  Friend3 = 2 << 3,

  Enemy1 = 2 << 11,
  Enemy2 = 2 << 12,
  Enemy3 = 2 << 13,

  /** 友方势力 */
  GroupFriend = Player | Friend1 | Friend1,
  /** 敌方势力 */
  GroupEnemy = Enemy1 | Enemy2 | Enemy3,
  /** 中立单位 */
  GroupNeutral = 2 << 30,
}

/** 单位朝向，允许模拟“每一个面都是正面”的效果 */
export enum UnitDirection {
  /** 前方 */
  Forward = 2 << 0,
  /** 后方 */
  Back = 2 << 1,
  /** 左方 */
  Left = 2 << 2,
  /** 右方 */
  Right = 2 << 3,
}

export interface BaseUnitAttr {
}
export interface UnitAttr extends BaseUnitAttr {
  /** 血量 */
  hp: number;
  /** 血量上限 */
  hpMax: number;
  /** 攻击力 */
  attack: number;
  /** 防御 */
  defense: number;
  /** 攻击范围 */
  attackRange: number;
  /** 朝向 */
  direction: UnitDirection;
  /** 行动速度，每达到100可以行动一轮 */
  turnSpeed: number;
  /** 友军标记 */
  friendFlag: number;
  /** 心情 */
  emotion: number;
  /** 饥饿 */
  hunger: number;
  /** 体重 */
  weight: number;
  /** 花色 */
  appearance: number;

  /** 攻击前摇 */
  attackDurationBefore: number;
  /** 攻击后摇 */
  attackDurationAfter: number;
}

// export type EUnit = {
//   turnReady: () => void, // 可以攻击
//   dead: () => void, // 死亡
//   beforeDamage: () => void; // 被攻击
// }

export interface EUnit {
  turnReady: () => void; // 可以攻击
  dead: () => void; // 死亡
  beforeDamage: () => void; // 被攻击
}

export class Unit extends SObject {
  ev: Emitter<EUnit>;
  attr = new Attribute<UnitAttr>(this).proxy();
  attack = new UnitAttack(this);

  @observable
  buffs: Buff[] = [];

  /** 是否存活，这个设计不是很好，先暂时使用。注意外部不要乱改 */
  isAlive = false;

  /** 当前动作，TODO: 对是否能施加action做检查 */
  currentAction: Action;

  $mobxDispose = [];

  constructor() {
    super();
    const attr = this.attr;
    attr.hp = 10;
    attr.hpMax = 10;
    attr.attack = 2;
    attr.attackRange = 3;
    attr.defense = 1;
    attr.direction = UnitDirection.Forward;
    attr.friendFlag = FriendFlag.Player;

    // 合并
    attr.$attr.mergeFunc.friendFlag = (a, b) => a | b;
    attr.$attr.enableFactor.friendFlag = false;
    attr.$attr.mergeFunc.direction = (a, b) => a | b;
    attr.$attr.enableFactor.direction = false;

    // HP 为 0 时死亡
    let r = when(
      () => attr.hp == 0,
      () => {
        this.isAlive = false;
        this.ev.emit('dead');
      }
    );
    this.$mobxDispose.push(r);

    this.$mobxDispose.push(arrayAdded(this.buffs as IObservableArray<Buff>, (items, disposer) => {
      items.forEach((item) => {
        ;
      });
    }));

    this.$mobxDispose.push(arrayRemoved(this.buffs as IObservableArray<Buff>, (items, disposer) => {
      items.forEach((item) => {
        ;
      });
    }));

    makeObservable(this);
  }

  /**
   * 造成伤害
   * @param attacker 攻击者
   * @param source 伤害来源，为null则为攻击者普攻
   * @param damage 伤害数值
   */
  doHarm(attacker: Unit, source: object, damage: number) {
    this.attr.hp -= damage - this.attr.defense;
  }

  @computed
  get state() {
    let state: BuffState = 0;
    for (const i of this.buffs) {
      state |= i.state;
    }
    return state;
  }
 
  dispose() {
    super.dispose()
    for (const dispose of this.$mobxDispose) {
      dispose();
    }
  }
  // 继承
  // ev: Emitter<TEvent>;
  // attr: AttributeProxy<TAttr>;
}
