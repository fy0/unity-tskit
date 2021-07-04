import UIRaw_PageHome from "../../gen/ui/main/UIRaw_PageHome";
import { Game } from "../game";

export class UIPageHome extends UIRaw_PageHome {
  onConstruct () {
    super.onConstruct();
    const game = Game.inst;

    this.m_btnStart.onClick.Set(() => {
      // 开始游戏
      game.ui.openPageGame();
    });

    this.m_btnExit.onClick.Set(() => {
      // 退出游戏
      game.quit();
    });
  }
}
