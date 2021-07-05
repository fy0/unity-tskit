import { FairyGUI } from "csharp";

export class UIDialog<T extends FairyGUI.GComponent> extends FairyGUI.Window {
  viewCls: { createInstance(): T };
  extra: any;

  public constructor(viewCls: { createInstance(): T }) {
    super();

    this.__onInit = () => {
      this.contentPane = this.viewCls.createInstance();
      this.onInit();
    };

    this.__onShown = () => {
      this.Center();
      this.onShown();
    };

    this.__onHide = () => {
      this.onHide();
    };
    // this.__doShowAnimation = ()=> { this.doShowAnimation(); };
    // this.__doHideAnimation = ()=> { this.doHideAnimation(); };

    this.viewCls = viewCls;
  }

  get view (): T {
    return this.contentPane as T;
  }

  protected onInit () {
  }

  protected onShown () {
  }

  protected onHide () {
  }

  hide () {
    this.Hide();
  }

  show () {
    this.Show();
  }

  protected static windowCache = new Map<typeof UIDialog, UIDialog<any>>();

  static show<T extends { new (): UIDialog<any> }>(config = {
    modal: true,
    extra: null as any
  }) {
    let inst = this.windowCache.get(this);
    if (!inst) {
      // 这里其实隐含的要求下级必须重写 constructor
      inst = new (this as unknown as T)();
      this.windowCache.set(this, inst);
    }

    inst.modal = config.modal;
    inst.extra = config.extra;
    inst.Show();
  }
}
