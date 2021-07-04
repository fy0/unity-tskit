import { GameLoop } from './game-loop';

export class Game extends GameLoop {
  start() {
    // 绑定到游戏引擎
    this.bindToEngine()
    // 初始化game modules等
    this.init();
  }

  // singleton
  protected static _inst: Game;

  static get inst() {
    if (!Game._inst) Game._inst = new Game();
    return Game._inst;
  }

}
