import { game } from 'csharp';
import { SCoreObject } from '../core/object';
import { Emitter } from '../core/event';
import { Config } from './config';
import { TimeManager } from './modules/time-manager';
import { TaskManager } from './modules/task-manager';
import { UIManager } from './modules/ui-manage';
import { ProfileManager } from './modules/profile-manager';
import { Inventory, Items } from './modules/Inventory';
import { GameModule } from './base/game-module';
import { StoryManager } from './modules/story-manager';

interface EGame {
  set: (name: string, count: number) => void;
  update: (dt: number) => void;
  updateFixed: (dt: number) => void;
}

/** 核心逻辑类，与view层的结合点，相当于application */
export class GameLoop extends SCoreObject {
  ev: Emitter<EGame>;

  config = new Config();
  csMain: game.Main;

  // 注：直接将模块写为成员的原因，一方面task等模块大量使用，Game.inst.task.delay 比 Game.inst.mods.task.delay 好些；另一方面Game这个类暴露的东西不多。
  // modules
  time = new TimeManager(this as any);
  task = new TaskManager(this as any);
  ui = new UIManager(this as any);
  profile = new ProfileManager(this as any);
  inventory = new Inventory<typeof Items>(this as any);
  story = new StoryManager(this as any);
  // modules end

  // 优先初始化列表 - 表中模块会优先初始化，且有序
  precedenceInitMods = [
    this.time,
    this.profile,
    this.inventory
  ]

  protected _nextTicks = [];

  /** 下帧执行 */
  $nextTick(func: Function) {
    this._nextTicks.push(func);
  }

  /** 绑定到unity */
  protected bindToEngine() {
    this.csMain = game.Main.main;
    game.Main.jsUpdate = this.update.bind(this);
    game.Main.jsFixedUpdate = this.updateFixed.bind(this);
  }

  /** 退出游戏 */
  quit () {
    game.Main.main.Exit();
  }

  protected init() {
    console.log('模块初始化');
    // 初始化game modules
    const inited = new Set<GameModule>();
    for (const i of this.precedenceInitMods) {
      i.init.bind(i)();
      inited.add(i);
    }
    for (let i of Object.values(this)) {
      if (i instanceof GameModule && (!inited.has(i))) {
        i.init.bind(i)();
        inited.add(i);
      }
    }
    console.log('模块初始化完成');
  }

  /** 由游戏引擎进行调用 */
  protected updateFixed(dt: number) {
    // 更新时间管理器
    this.time.updateFixed(dt);
    // 更新任务管理器
    this.task.update(dt);
    // 发出 update 事件
    this.ev.emit('updateFixed', dt);
  }

  /** 由游戏引擎进行调用，脚本中所有update均从此处开始 */
  protected update(dt: number) {
    // 更新时间管理器，没错，是两次
    this.time.update(dt);
    // 处理 nextTick
    for (const i of this._nextTicks) {
      i();
    }
    this._nextTicks.length = 0;

    // 发出 update 事件
    this.ev.emit('update', dt);
  }
}
