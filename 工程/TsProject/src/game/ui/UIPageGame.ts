import UIRaw_PageGame from "../../gen/ui/main/UIRaw_PageGame";
import { Game } from "../game";

export class UIPageGame extends UIRaw_PageGame {
  onConstruct () {
    super.onConstruct();
    const s = Game.inst.story;

    this.m_btnStory.onClick.Set(async () => {
      // 剧情对话
      await s.tell('开发者你好');
      await s.tell('欢迎使用 tskit 框架');

      await s.tell('先采访一下你为什么使用这个框架');

      switch (await s.choices(['做游戏', '就是玩儿', '首先，我要试一下'])) {
          case 0:
              await s.tell('欢迎大佬。');
              break;
          case 1:
              await s.tell('_(¦3」∠)_');
              break;
          case 2:
              await s.tell('多试试，非常好用！');
              break;
      }

      await s.tell('P.S.');
      await s.tell('在正式使用之前， [b][color=#ff0000]强烈建议[/color][/b]先阅读一下项目路径下的README.md');
      await s.tell('祝你顺利。');
      s.hide();

    })

    this.m_btnBack.onClick.Set(() => {
      // 返回主界面
      Game.inst.ui.openPageHome();
    });
  }
}
