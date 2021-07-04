import { Unit } from './unit';
import { Action } from './action';
import { makeAutoObservable } from 'mobx';
import { SObject } from '../../core/object';
import { Emitter } from '../../core/event';

export interface EBuff {
  awake: () => void; // 实例化之后，生效之前
  start: () => void; // 生效之后第一个事件
  refresh: () => void; // 存在一个相同buff，且caster相同
  remove: () => void; // 移除之前（未从容器中移除）
  destroy: () => void; // 移除之后
  interval: () => void; // 定时触发
}

export enum BuffState {
  /** 眩晕 - 目标不再响应任何操控 */
  Stun = 2 << 0,
  /** 缠绕 - 目标不响应移动请求，但是可以执行某些操作，如施放某些技能 */
  Root = 2 << 1,
  /** 沉默 - 禁止释放技能 */
  Slience = 2 << 2,
  /** 无伤 - 不会收到伤害，但不禁止被施加任何效果 */
  NoHarm = 2 << 3,
  /** 无敌 - 几乎不受到所有的伤害和效果影响 */
  Invincible = 2 << 4,
  /** 隐身 - 不能被其他目标看到 */
  Invisible = 2 << 5,
  // Spelling // 吟唱
  // 不可选中 Unselectable
}

export enum BuffTag {
  ModifyAttribute, // 属性修改
  ModifyMotion, // 运动修改
}

export class Buff extends SObject {
  ev: Emitter<EBuff>;

  parent: Unit; // 挂载目标
  caster: Unit; // 施加者
  creator: Action; // 由哪个技能创建
  layers: number; // 层数
  level: number; // 等级
  duration: number; // 持续时长
  state: BuffState; // 状态
  tag: any;
  tagImmune: any;

  motionApply(motionTypeId, priority, forceInterrrupt) {}

  constructor() {
    super();
    makeAutoObservable(this, {
      ev: false,
    });
  }

  static create(caster: Unit, parent: Unit): Buff {
    // 检查是否有免疫此buff的buff

    const b = new Buff();
    b.caster = caster;
    b.parent = parent;

    b.ev.emit('awake');

    return b;
  }
}
