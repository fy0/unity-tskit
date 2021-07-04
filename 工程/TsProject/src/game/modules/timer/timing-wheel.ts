import { TimerTaskList, TimerTaskEntry } from './timer-task-list';
import { DelayQueue } from './delay-queue';

export class TimingWheel {
  /** 时间粒度 */
  tickMs: number;
  /** 时间轮大小 */
  wheelSize: number;
  /** 整轮周期时间 */
  interval: number;
  /** 上级时间轮 */
  overflowWheel: TimingWheel = null;
  /** 底层时间轮，时间粒度最小的那个，kafka原版没这个，这是等价实现。 */
  root: TimingWheel;
  buckets: TimerTaskList[];
  currentTime: number;
  dq: DelayQueue;

  /**
   *
   * @param tickMs 时间粒度，游戏在60帧时是16ms update一次，建议不小于10ms，默认为10ms
   * @param wheelSize 时间轮大小，默认为20（向kafka学习），在时间粒度为10ms情况下，3轮就有160s足够大多数场景使用，10轮6494年
   * @param startMs 开始时间
   */
  constructor(
    tickMs: number = 10,
    wheelSize = 20,
    startMs = 0,
    dq: DelayQueue = null,
    root: TimingWheel = null
  ) {
    this.tickMs = tickMs;
    this.wheelSize = wheelSize;
    this.interval = tickMs * wheelSize;
    this.buckets = [...Array(wheelSize)].map((_) => new TimerTaskList());
    this.currentTime = startMs - (startMs % tickMs); // rounding down to multiple of tickMs
    this.dq = dq;
    this.root = root === null ? this : root;
  }

  /** 升级到上层时间轮 */
  addOverflowWheel() {
    if (!this.overflowWheel) {
      this.overflowWheel = new TimingWheel(
        this.interval,
        this.wheelSize,
        this.currentTime,
        this.dq,
        this.root
      );
    }
  }

  add(timerTaskEntry: TimerTaskEntry) {
    const expiration = timerTaskEntry.expirationMs;
    // console.log('ADD', expiration, this.currentTime, this.interval);
    if (timerTaskEntry.cancelled) {
      return false;
    } else if (expiration < this.currentTime + this.tickMs) {
      // Already expired
      return false;
    } else if (expiration < this.currentTime + this.interval) {
      // Put in its own bucket
      const virtualId = Math.floor(expiration / this.tickMs);
      const bucket = this.buckets[virtualId % this.wheelSize];

      bucket.add(timerTaskEntry);

      // 原版的 bucket 是 java.util.concurrent.Delayed 类型，又是timer，这里使用等价替代操作
      const newExpiration = virtualId * this.tickMs;

      if (bucket.expiration !== newExpiration) {
        bucket.expiration = newExpiration;

        this.dq.callAt(bucket.expiration, {
          cancelled: false,
          execute: () => {
            this.root.advanceClock(bucket.expiration);
            bucket.flush(this.root);
          },
        });
      }
      return true;
    } else {
      // Out of the interval. Put it into the parent timer
      if (this.overflowWheel == null) this.addOverflowWheel();
      return this.overflowWheel.add(timerTaskEntry);
    }
  }

  /**
   * Try to advance the clock
   * 注：由于 DelayQueue的存在，时间轮不用真的向后推，所以这个是用来更新状态的
   * @param currentTimeMs
   */
  advanceClock(currentTimeMs: number) {
    if (currentTimeMs >= this.currentTime + this.tickMs) {
      this.currentTime = currentTimeMs - (currentTimeMs % this.tickMs);

      // Try to advance the clock of the overflow wheel if present
      if (this.overflowWheel != null) {
        this.overflowWheel.advanceClock(this.currentTime);
      }
    }
  }
}
