import { MinHeap, Node } from 'mheap';

interface DelayTask {
  execute: Function;
  cancelled: boolean;
}

/**
 * 一个定时调用队列
 * 这是一个最小堆，因此插入和移除的效率是O(logN)
 * 而每帧都需要进行的检查是否到期操作则是O(1)，这比传统的遍历方式大大优化了。
 */
export class DelayQueue {
  heap: MinHeap<DelayTask>;
  getCurrentTime: () => number;

  /**
   * @param getCurrentTime 获取基准时间的函数
   */
  constructor(getCurrentTime) {
    this.heap = new MinHeap<DelayTask>();
    this.getCurrentTime = getCurrentTime;
  }

  callAfter(duration: number, task: DelayTask) {
    this.heap.insert(this.getCurrentTime() + duration, task);
  }

  callAt(expiration: number, task: DelayTask) {
    // console.log(`callAt ${expiration}`);
    this.heap.insert(expiration, task);
  }

  update(dt: number) {
    let root = this.heap.root;
    while (root && this.getCurrentTime() >= root.key) {
      const t = root.value;
      if (!t.cancelled) {
        try {
          t.execute();
        } catch (e) {
          console.error(e);
        }
      }
      this.heap.remove(0);
      root = this.heap.root;
    }
  }
}
