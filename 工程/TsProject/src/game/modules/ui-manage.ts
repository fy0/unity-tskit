import { FairyGUI, Unity, UnityEngine } from 'csharp';
import { bind } from '../../gen/ui/main/fairygui';
import mainBinder from '../../gen/ui/main/mainBinder';
import { UIMain } from '../ui/UIMain';
import { UIPageGame } from '../ui/UIPageGame';
import { GameModule } from '../base/game-module';
import { UIPageHome } from '../ui/UIPageHome';
import { Game } from '../game';

export class UIManager extends GameModule {
  binds = [
    // 将自己写的页面/组件写在这里
    UIMain,
    UIPageGame,
    UIPageHome
  ]

  /** 主页面对象 */
  uiMain: UIMain;

  init () {
    FairyGUI.UIPackage.AddPackage("FairyGUI-dist/main");
    mainBinder.bindAll();

    // bind pages
    for (const i of this.binds) {
      bind(i);
    }

    // bind dialogs

    // main init
    this.uiMain = UIMain.createInstance();
    const GRoot = FairyGUI.GRoot;

    // 备用。请注意resolution和screen size的不同。
    // const safeArea = UnityEngine.Screen.safeArea;
    // UnityEngine.Screen.width, UnityEngine.Screen.height

    // const resolution = UnityEngine.Screen.currentResolution;
    // console.log(222, resolution.width, resolution.height);

    // 注意一件事情：这里应该设置为UI工程的设计分辨率，而不是屏幕分辨率
    GRoot.inst.SetContentScaleFactor(1600, 900);

    // this.uiMain.SetSize(GRoot.inst.width, GRoot.inst.height);
    // this.uiMain.AddRelation(GRoot.inst, FairyGUI.RelationType.Size);

    GRoot.inst.AddChild(this.uiMain);
}

  /** 游戏主菜单界面 */
  async openPageHome () {
    this.uiMain.m_page_state.selectedIndex = 0;
  }

  /** 游玩界面 */
  async openPageGame () {
    this.uiMain.m_page_state.selectedIndex = 1;
  }

  /** 游戏加载界面 */
  async openPageGameLoading() {}

  /** 资源加载（远程下载） */
  async openPageResLoading() {}
}
