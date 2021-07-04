import { GameLoop } from '../game-loop';
import { action, computed, makeObservable, observable } from 'mobx';
import { Person } from './dice';
import { Game } from '../game';
import { clamp, property } from 'lodash';
import { SObject } from '../../core/object';
import { Unit } from '../base/unit';
import { GameModule } from '../base/game-module';

class EcoAttr extends SObject {
  @action
  fixCar() {
    this._hp = this.hpMax;
  }

  game: Game;

  @observable
  depth = 10;

  @observable
  winFlag = false;

  getVal(name: string) {
    let n = 0
    for (let i of this.game.profile.cur.person) {
      n += i[name];
    }
    return n;
  }

  /** 挖掘能力 */
  @computed
  get mine () {
    return this.game.inventory.get('tech_mine') + this.getVal('mine');
  }

  /** 工程 */
  @computed
  get craft () {
    return this.game.inventory.get('tech_craft') + this.getVal('craft');
  }

  /** 鉴定 */
  @computed
  get identity () {
    return this.game.inventory.get('tech_identify') + this.getVal('identify');
  }

  /** 声望 */
  @computed
  get repute () {
    return this.game.inventory.get('repute');
  }

  /** 回合经费 */
  @computed
  get costPerRound() {
    return this.getVal('salary') + 10;
  }

  @observable
  hpMax = 10;

  @observable
  _hp = 10;

  @computed
  get hp() {
    return this._hp;
  }

  @computed
  get goldToCash () {
    let ex = 0;
    ex += clamp(this.mine, 0, 15 * 2);
    
    if (this.mine > 15) {
      ex += Math.ceil((clamp(this.mine, 15, 80)-15) / 1.5);
    }
    
    if (this.mine > 80) {
      ex += (this.mine - 80) / 3;
    }

    return 10 + ex;
  }

  reduceHp(val: number) {
    this._hp = clamp(this._hp - val, 0, this.hpMax);
  }

  init () {
    makeObservable(this);
  }
}

export class Profile extends SObject {
  /** 当前队伍 */
  team: Unit[] = [];
  /** 道具 */
  items: any[] = [];
  /** 好感度 */
  favorable: { [id: number]: number } = {};
  /** 时间 */
  time: number;
  /** 天数 */
  day: number = 1;

  @observable
  stage = 1; // 地上1 地下2

  @observable
  person: Person[] = [];

  constructor(game: GameLoop) {
    super()

    makeObservable(this);
  }
}

export class ProfileManager extends GameModule {
  cur: Profile;
  profiles: Profile[] = [];

  eco = new EcoAttr();

  hire(p: Person) {
    const game = this.game as Game;
    this.cur.person.push(p);
  }

  init () {
    const game = this.game;
    // TODO: 示例存档
    const p = new Profile(game);
    this.profiles.push(p);
    this.eco.attach(game);
    this.cur = p;
  }
}
