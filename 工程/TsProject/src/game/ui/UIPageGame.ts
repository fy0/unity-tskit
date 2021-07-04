import UIRaw_PageGame from "../../gen/ui/main/UIRaw_PageGame";
import { Game } from "../game";

export class UIPageGame extends UIRaw_PageGame {
  onConstruct () {
    super.onConstruct();

    this.m_btnBack.onClick.Set(() => {
      // 返回主界面
      Game.inst.ui.openPageHome();
    });
  }
}
