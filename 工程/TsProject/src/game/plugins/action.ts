import { Unit } from './unit';
import { makeAutoObservable, autorun, reaction, observable } from 'mobx';
import { SObject } from '../../core/object';
import { Emitter } from '../../core/event';

export interface EAction {
  stateChange: (newVal: ActionState, oldVal: ActionState) => void;
}

/** 动作执行阶段，默认的动作转换是不被打断的，如果需要被打断，自行配置buff */
export enum ActionState {
  /** 准备阶段，默认状态 */
  Prepare = 0,
  /** 前摇 */
  DuringBefore = 10,
  /** 动作中 */
  DuringAction = 20,
  /** 后摇 */
  DuringAfter = 30,
  /** 完成 */
  Done = 40,

  /** 取消 */
  Canceled = 100,
}

/**
 * 行动，如一次施法，一次攻击
 */
export class Action extends SObject {
  ev: Emitter<EAction>;
  caster: Unit; // 释放者

  @observable
  state = ActionState.Prepare;

  /** 自定义数据 */
  extra: any;

  // 注意，很多法术的属性可能能被单位属性所加成，此外有些是对象，有些是getter
  /** 前摇时间，如果此时被打断则不能产生效果 */
  durationBefore: number = 0;
  /** 动作时间，进入此时间时一般效果已经造成，多用于强制不能打断的动作表现 */
  durationAction: number = 0;
  /** 后摇时间，和动作时间差不多，但可能会允许玩家通过技巧取消后摇 */
  durationAfter: number = 0;

  targets: Unit[]; // 影响目标

  /** 想要执行（数据已经齐备） */
  check(): boolean {
    return true;
  }

  constructor() {
    super();
    makeAutoObservable(true);

    reaction(
      () => this.state,
      (value, previousValue) => {
        this.stateChange(value, previousValue);
        this.ev.emit('stateChange', value, previousValue);
      }
    );
  }

  /** 内部就不订阅事件了，方便操作 */
  stateChange(value: ActionState, previousValue: ActionState) {}

  cancelWhenNext: boolean = false;

  /** 打断动作 */
  break () {
    if (this.state == ActionState.Done) {
      return;
    }

    if (this.state == ActionState.DuringAction) {
      this.cancelWhenNext = true;
    } else {
      this.state = ActionState.Canceled;
    }
  }

  /** 开始执行 */
  async start() {
    if (this.check()) {
      const goState = async (duration: number, nextState: ActionState) => {
        if (duration !== 0) await this.$delay(duration);
        if (this.cancelWhenNext) {
          // 下轮取消机制：当前状态在delay之后才转换为cancel
          this.state = ActionState.Canceled;
          return false;
        }

        if (this.state === ActionState.Canceled) return false;
        this.state = nextState;
        return true;
      };

      this.state = ActionState.DuringBefore;
      if (!(await goState(this.durationBefore, ActionState.DuringAction)))
        return;
      if (!(await goState(this.durationAction, ActionState.DuringAfter)))
        return;
      if (!(await goState(0, ActionState.Done))) return;
    }
  }
}

export class AttackAction extends Action {
  damage: number = 0; // 伤害

  action() {
    for (let i of this.targets) {
      i.attr.hp;
    }
  }
}
