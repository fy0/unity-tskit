import { Emitter } from './event';
import { TimerTaskEntry } from '../game/modules/timer/timer-task-list';
import { Game } from '../game/game';

export class SCoreObject {
  ev = new Emitter(this);
  game: Game;
}

export class SObject extends SCoreObject {
  protected _updateHandler = null;
  protected _delayAndIntervals = new Set<Promise<any> | TimerTaskEntry>();

  /** 开启循环 */
  enableUpdate() {
    if (this.game) {
      this._updateHandler = this.update.bind(this);
      this.game.ev.on('update', this._updateHandler);
    }
  }

  /** 启用 */
  attach(game: Game) {
    this.game = game;
    this.init();
  }

  /** 初始化，在attach后被调用 */
  init () {
    ;
  }

  /** 清理 */
  dispose() {
    if (this._updateHandler) {
      this.game.ev.off('update', this._updateHandler);
    }

    for (const i of this._delayAndIntervals) {
      this.game.task.cancel(i);
    }
  }

  /** 下帧执行 */
  $nextTick(func: Function) {
    this.game.$nextTick(func);
  }

  /**
   * 延迟执行。可传入回调。对象销毁后自动终止
   * @param duration 等待时间
   * @param callback 回调
   */
  $delay(duration: number, callback: Function = null): Promise<any> {
    const p = this.game.task.delay(duration, () => {
      this._delayAndIntervals.delete(p);
      if (callback) callback();
    });
    this._delayAndIntervals.add(p);
    return p;
  }

  /**
   * 间隔执行
   * @param duration 间隔时间
   * @param callback 回调
   */
  $interval(duration: number, callback: Function = null): TimerTaskEntry {
    const p = this.game.task.interval(duration, callback);
    this._delayAndIntervals.add(p);
    return p;
  }

  /** 必须在 enableUpdate 之后才工作 */
  update(dt: number) {}
}
