import { computed, makeAutoObservable, makeObservable, observable } from 'mobx';
import { Unit } from './unit';

export class AttrAddition<T extends object> {
  base: Partial<T> = {};
  factor: Partial<T> = {};

  // 注意，这里写两个 Partial<T> 会被要求传入的两个值 key 一样，所以写为any
  constructor(base: Partial<T> = null, factor: any = null) {
    this.base = base || {};
    this.factor = factor || {};
  }
}

export type AttributeProxy<T extends object> = T & {
  $attr: Attribute<T>;
  $base: T;
  $additions: AttrAddition<T>[];
};

/**
 * 属性基类
 * 负责装载数字属性，能够处理buff带来的动态属性加成（包括固定数值属性和系数加成属性两种）
 * 属性被储存在base里面，所有加成属性被储存在additions里面，最终从外部获取到的属性数值是：(基础属性 + 外部直接加成之和) * 加成系数之和
 * 
 * 属性值在某种情况下会被缓存，只在base和additions发生改变时才跟着改变。
 * 同时，可以订阅属性值的变化，这在UI展示数据时很有用。
 * 
  使用举例：
  interface PlayerAttr {
    hp: number;
    hpMax: number;
    
    atk: number;
  }

  const a = new Attribute<PlayerAttr>().proxy();
  a.hp = 100;

  // 监听变化
  autorun(() => {
    console.log(`生命值发生变化: ${a.hp}`)
  })

  // 直接改变属性
  a.hp = 200;

  // 添加buff
  a.$additions.push(new AttrAddition({
    hp: 30,
  }, {
    atk: 0.3
  }))

 */
export class Attribute<T extends { [key: string]: any }> {
  parent: Unit; // 挂载目标

  @observable
  base = {} as T;

  /** 用于值合并的函数，默认全部相加 */
  // mergeFunc: { [key: keyof T]: Function } = {
  @observable
  mergeFunc: { [key: string]: (a: any, b: any) => any } = {
    $default: (a, b) => a + b,
  };

  /** 如果为true，这个值受到系数加成 */
  @observable
  enableFactor: { [key: string]: boolean } = {
    $default: true,
  };

  @observable
  additions: AttrAddition<T>[] = [];

  protected _valCache = {};

  constructor(parent: Unit = null) {
    this.parent = parent;
    makeObservable(this);
  }

  getAttrNum(name: string | number) {
    if (!(name in this._valCache)) {
      this._valCache[name] = computed(() => {
        if (name in this.base) {
          let vals = [this.base[name]];
          let factor = 1.0;
          const factorEnable =
            name in this.enableFactor
              ? this.enableFactor[name]
              : this.enableFactor.$default;

          for (let i of this.additions) {
            if (name in i.base) {
              vals.push(i.base[name]);
            }

            if (factorEnable) {
              if (name in i.factor) {
                factor += i.factor[name];
              }
            }
          }

          this.mergeFunc.$default;
          const mergeFunc =
            name in this.mergeFunc
              ? this.mergeFunc[name]
              : this.mergeFunc.$default;

          let val = vals.reduce(mergeFunc);
          if (factorEnable) val *= factor;

          return val;
        }
        return undefined;
      });
    }
    return this._valCache[name].get();
  }

  proxy() {
    const obj = this;
    const setBaseAttr = (k, v) => {
      // to skip [MobX] strict-mode warning
      this[k] = v;
    };

    return new Proxy<AttributeProxy<T>>(this as any, {
      get(_, prop) {
        switch (prop) {
          case '$attr':
            return obj;
          case '$base':
            return obj.base;
          case '$additions':
            return obj.additions;
        }
        if (prop === '$base') return obj.base;
        return obj.getAttrNum(prop as string);
      },

      set(_, prop, value) {
        switch (prop) {
          case '$base':
            obj.base = value;
            return true;
          case '$additions':
            // obj.additions = value;
            return false;
          default:
            // if (prop in obj.base) {
            setBaseAttr(prop, value);
            // obj.base[prop] = value;
            return true;
            // }
            // return false;
        }
      },
    });
  }
}
