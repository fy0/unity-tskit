import { Action, ActionState } from "./action";
import { BuffState } from "./buff";
import { FriendFlag, Unit } from "./unit";

export class UnitAttack {
  parent: Unit; // 挂载目标

  constructor(parent: Unit = null) {
    this.parent = parent;
    // makeObservable(this);
  }

  /** 是否允许强行攻击 */
  canForceAttack(u: Unit): boolean {
    // 只要不无敌就可以
    return (u.state & BuffState.Invincible) == 0;
  }

  /** 是否允许正常攻击(不考虑主动进行队友伤害的情况) */
  canNormalAttack(u: Unit): boolean {
    if ((u.state & BuffState.Invincible) != 0) {
      return false;
    }
    // 如果是友方，那么目标不应属于友方
    if ((this.parent.attr.friendFlag & FriendFlag.GroupFriend) != 0) {
      return (u.attr.friendFlag & FriendFlag.GroupFriend) == 0;
    }
    // 如果是敌方，那么目标不应属于敌方
    if ((this.parent.attr.friendFlag & FriendFlag.GroupEnemy) != 0) {
      return (u.attr.friendFlag & FriendFlag.GroupEnemy) == 0;
    }
    // 如果都不属于（一般不可能发生这样情况）
    return true;
  }

  // 攻击分类：
  // 主动自动攻击
  // 设定目标后自动攻击
  // 点一下打一下

  /** 设定攻击目标 */
  setTarget(u: Unit) {
    ;
  }

  doAttack(u: Unit) {
    const act = new Action();
    act.durationBefore = this.parent.attr.attackDurationBefore || 0; // 前摇
    act.durationAction = 0; // 攻击动作
    act.durationAfter = this.parent.attr.attackDurationAfter || 0; // 后摇

    act.ev.on('stateChange', (value, previousValue) => {
      if (value === ActionState.DuringAction) {
        // 发出攻击时按照当前状态施加伤害
        u.doHarm(this.parent, null, this.parent.attr.attack);
      }
    })

    act.start();
    this.parent.currentAction = act;
    return act;
  }
}
