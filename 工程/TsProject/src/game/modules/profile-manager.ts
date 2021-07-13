import { makeObservable } from 'mobx';
import { Game } from '../game';
import { SObject } from '../../core/object';
import { GameModule } from '../base/game-module';

export class Profile extends SObject {
  /** 当前队伍 */
  /** 道具 */
  items: any[] = [];
  /** 好感度 */
  favorable: { [id: number]: number } = {};
  /** 时间 */
  time: number;
  /** 天数 */
  day: number = 1;

  constructor(game: Game) {
    super()

    // makeObservable(this);
  }
}

export class ProfileManager extends GameModule {
  cur: Profile;
  profiles: Profile[] = [];

  init () {
    const game = this.game;
    // TODO: 示例存档
    const p = new Profile(game);
    this.profiles.push(p);
    this.cur = p;
  }
}
