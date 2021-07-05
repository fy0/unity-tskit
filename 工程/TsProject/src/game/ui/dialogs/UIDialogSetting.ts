import UIRaw_DialogSetting from "../../../gen/ui/main/UIRaw_DialogSetting";
import { UIDialog } from "./UIDialog";

export class DialogSetting extends UIDialog<UIRaw_DialogSetting> {
  constructor() {
    super(UIRaw_DialogSetting);
  }

  protected onInit() {
    this.view.m_btnYes.onClick.Set(() => {
      console.log('click yes');
      this.Hide();
    });

    this.view.m_btnNo.onClick.Set(() => {
      console.log('click no');
      this.hide();
    });
  }

  protected onShown () {
    // 同步设置
  }
}
