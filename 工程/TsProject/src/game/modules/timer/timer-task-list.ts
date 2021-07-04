import { TimingWheel } from './timing-wheel';

/**
 * 时间轮的Bucket，链表
 * 在原版中，这东西是个Delay对象（可以被丢进DelayQueue队列），自然也有到时间后被执行的函数，正是在那个函数中做了推进时间轮的操作。
 * 不过推进时间轮的代码并不在这个类中，原版的这个类是timer(一个trait，类似interface)的实现，在那里做了相关的操作。
 *
 * 我们可以使用更灵活的方式，TimerTaskList只作为链表存在就好，相应的操作交给时间轮进行。
 */
export class TimerTaskList {
  root: TimerTaskEntry;
  #expiration = -1;

  get expiration() {
    return this.#expiration;
  }

  /**
   * Set the bucket's expiration time
   * Returns true if the expiration time is changed
   */
  set expiration(expirationMs: number) {
    this.#expiration = expirationMs;
  }

  *[Symbol.iterator]() {
    let entry = this.root.next;
    while (entry !== this.root) {
      const nextEntry = entry.next;

      if (!entry.cancelled) yield entry;

      entry = nextEntry;
    }
  }

  constructor() {
    // TimerTaskList forms a doubly linked cyclic list using a dummy root entry
    // root.next points to the head
    // root.prev points to the tail
    this.root = new TimerTaskEntry(-1, null);
    this.root.next = this.root;
    this.root.prev = this.root;
  }

  /** 插入到链表，成为新的尾节点 */
  add(timerTaskEntry: TimerTaskEntry) {
    let done = false;
    while (!done) {
      // Remove the timer task entry if it is already in any other list
      // We do this outside of the sync block below to avoid deadlocking.
      // We may retry until timerTaskEntry.list becomes null.
      timerTaskEntry.remove();

      if (timerTaskEntry.list == null) {
        // put the timer task entry to the end of the list. (root.prev points to the tail entry)
        let tail = this.root.prev;
        timerTaskEntry.next = this.root;
        timerTaskEntry.prev = tail;
        timerTaskEntry.list = this;
        tail.next = timerTaskEntry;
        this.root.prev = timerTaskEntry;
        done = true;
      }
    }
  }

  remove(timerTaskEntry: TimerTaskEntry) {
    if (timerTaskEntry.list === this) {
      timerTaskEntry.next.prev = timerTaskEntry.prev;
      timerTaskEntry.prev.next = timerTaskEntry.next;
      timerTaskEntry.next = null;
      timerTaskEntry.prev = null;
      timerTaskEntry.list = null;
    }
  }

  // Remove all task entries and apply the supplied function to each of them
  flush(rootTimingWheel: TimingWheel) {
    let head = this.root.next;
    while (head !== this.root) {
      const next = head.next;
      this.remove(head);

      if (!head.cancelled) {
        // 时间轮降级，如果插入失败证明是当前轮的当前tick，则运行
        if (!rootTimingWheel.add(head)) {
          // Already expired
          if (head.execute) {
            // 时间轮的核心调用
            head.execute();
          }

          // interval 支持：重新插入队列
          if (rootTimingWheel && head.intervalDuration !== null) {
            const i = head;
            i.expirationMs += i.intervalDuration;
            rootTimingWheel.add(i);
          }
        }
      }

      head = next;
    }
    this.expiration = -1;
  }
}

/**
 * 链表节点，这同时是一个 mheap 的 Node
 * 原版还有个 TimerTask，是个 Runnable，这里不要了，执行函数直接和链表节点绑一块就行
 */
export class TimerTaskEntry {
  list: TimerTaskList = null;
  next: TimerTaskEntry = null;
  prev: TimerTaskEntry = null;

  /** 预计执行时间 */
  expirationMs: number;
  /** 是否取消 */
  cancelled: boolean = false;
  /** 时间到了被执行的函数 */
  execute: Function;
  /** 如果此项不为 null，在执行结束后，从expiration上再加intervalDuration作为新的expiration重新入队 */
  intervalDuration: number;

  // 只能设置一次，只读
  get key() {
    return this.expirationMs;
  }

  /**
   *
   * @param expirationMs delay时使用
   * @param execute 回调函数
   * @param duration
   */
  constructor(
    expirationMs: number,
    execute: Function,
    intervalDuration: number = null
  ) {
    this.execute = execute;
    this.expirationMs = expirationMs;
    this.intervalDuration = intervalDuration;
  }

  remove() {
    var currentList = this.list;
    // If remove is called when another thread is moving the entry from a task entry list to another,
    // this may fail to remove the entry due to the change of value of list. Thus, we retry until the list becomes null.
    // In a rare case, this thread sees null and exits the loop, but the other thread insert the entry to another list later
    // while (currentList != null) {
    //   currentList.remove(this);
    //   currentList = this.list;
    // }
    // 不考虑注释中的情况：
    if (currentList != null) {
      currentList.remove(this);
    }
  }
}
