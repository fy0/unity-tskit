import { autorun } from "mobx";
import UIRaw_Main from "../../gen/ui/main/UIRaw_Main";
import { Game } from "../game";
import { DialogSetting } from "./dialogs/UIDialogSetting";

export class UIMain extends UIRaw_Main {
  onConstruct () {
    super.onConstruct();

    const game = Game.inst;

    // 示例：每秒钟增加一块钱，UI会同步进行自动更新
    game.task.interval(1000, () => {
      game.inventory.earn({'cash': 1});
    });

    autorun(() => {
      // 数据 -> UI 自动同步：持有金钱
      this.m_lbCoin.text = `${game.inventory.get('cash')}`;
    });

    this.m_btnSetting.onClick.Set(() => {
      // 弹出设置窗口
      DialogSetting.show();
    });
  }
}
