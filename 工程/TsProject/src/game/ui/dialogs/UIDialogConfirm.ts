import UIRaw_DialogConfirm from "../../../gen/ui/main/UIRaw_DialogConfirm";
import { UIDialog } from "./UIDialog";

export class DialogConfirm extends UIDialog<UIRaw_DialogConfirm> {
  constructor() {
    super(UIRaw_DialogConfirm);
  }

  protected onInit() {
    this.view.m_btnYes.onClick.Set(() => {
      console.log('click yes');
      this.hide();
    });

    this.view.m_btnNo.onClick.Set(() => {
      console.log('click no');
      this.hide();
    });
  }

  protected onShown () {
    // 同步设置
    this.view.m_text.text = (this.extra && this.extra.text) || '是否确定？'; // 将 extra.text 设定为询问文本
  }
}
