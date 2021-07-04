import { SCoreObject } from '../../core/object';
import { Game } from '../game';

/** 游戏主要模块 */
export class GameModule extends SCoreObject {
  constructor(game: Game) {
    super();
    this.game = game;
  }

  init() {}
}
