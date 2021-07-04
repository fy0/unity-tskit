import { GameModule } from '../base/game-module';

export class TimeManager extends GameModule {
  /** 游戏逻辑时间，暂停时不计入 */
  logicTime = 0;

  /** 游戏运行时间 */
  startTime = 0;

  /** 现实时间 */
  realityTime = 0;

  updateFixed(dt: number) {
    let dtMs = dt * 1000;
    this.startTime += dtMs;
    this.realityTime += dtMs;
  }

  /** 注：TimerManager的update会被强制调用，这和其他Object不同 */
  update(dt) {
    let dtMs = dt * 1000;
    this.logicTime += dtMs;
  }
}
