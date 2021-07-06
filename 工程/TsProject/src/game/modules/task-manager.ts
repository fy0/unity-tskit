import { GameModule } from '../base/game-module';
import { DelayQueue } from './timer/delay-queue';
import { TimingWheel } from './timer/timing-wheel';
import { TimerTaskEntry } from './timer/timer-task-list';
import { Game } from '../game';

/**
 * 任务管理器
 * 基于小顶堆和时间轮算法的高效任务调度器，提供timer支持
 */
export class TaskManager extends GameModule {
  #wheel: TimingWheel;
  #dq: DelayQueue;
  #history = new Map<Promise<any>, TimerTaskEntry>();

  getDelayQueue() {
    return this.#dq;
  }

  constructor(game: Game) {
    super(game);
    this.#dq = new DelayQueue(() => this.game.time.logicTime);
    this.#wheel = new TimingWheel(10, 20, game.time.logicTime, this.#dq);
  }

  /** 取消一个周期调用，或者延迟调用 */
  cancel(p: Promise<any> | TimerTaskEntry) {
    if (p instanceof TimerTaskEntry) {
      if (!p.cancelled) {
        p.cancelled = true;
        p.remove();
        return true;
      }
    } else {
      const t = this.#history.get(p);
      if (t) {
        t.cancelled = true;
        // t.remove();
        return true;
      }
    }
    return false;
  }

  /**
   *  周期调用
   * @param duration 周期时间，单位ms
   * @param callback 回调函数
   * @returns 
   */
  interval(duration: number, callback: Function = null): TimerTaskEntry {
    if (duration < this.#wheel.tickMs) {
      throw new Error(
        `间隔时间粒度 ${duration} 小于最小允许时间 ${this.#wheel.tickMs}`
      );
    }
    const node = new TimerTaskEntry(
      this.game.time.logicTime + duration,
      callback,
      duration
    );

    this.#wheel.add(node);
    return node;
  }

  /**
   * 延迟调用
   * @param duration 周期时间，单位ms
   * @param callback 回调函数
   * @returns 
   */
  delay(duration: number, callback: Function = null): Promise<any> {
    if (duration < this.#wheel.tickMs) {
      throw new Error(
        `间隔时间粒度 ${duration} 小于最小允许时间 ${this.#wheel.tickMs}`
      );
    }
    const node = new TimerTaskEntry(this.game.time.logicTime + duration, null);

    const promise = new Promise((resolve, reject) => {
      const delayDone = () => {
        this.#history.delete(promise);
        if (callback) callback();
        resolve(null);
      };
      node.execute = delayDone;
      this.#wheel.add(node);
    });

    this.#history.set(promise, node);
    return promise;
  }

  update(dt: number) {
    this.#dq.update(dt);
  }
}
