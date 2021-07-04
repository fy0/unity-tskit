/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { FairyGUI, System } from "csharp";

export function bind(cls: new () => FairyGUI.GComponent) {
  FairyGUI.UIObjectFactory.SetPackageItemExtension((cls as any).URL, () => {
    const obj = new cls();

    const tryBind = (actionName: string, funcName: string) => {
      // 存在则进行绑定
      if (funcName in obj && typeof obj[funcName] === 'function') {
        obj[actionName] = new System.Action(obj[funcName].bind(obj));
      }
    }

    tryBind('__onConstruct', 'onConstruct');
    tryBind('__onDispose', 'onDispose');

    tryBind('__onInit', 'onInit');
    tryBind('__onShown', 'onShown');
    tryBind('__onHide', 'onHide');
    tryBind('__doShowAnimation', 'doShowAnimation');
    tryBind('__doHideAnimation', 'doHideAnimation');

    return obj;
  });
}
