import UIRaw_DialogToast from "../../../gen/ui/main/UIRaw_DialogToast";
import { UIDialog } from "./UIDialog";

export class DialogToast extends UIDialog<UIRaw_DialogToast> {
  constructor() {
    super(UIRaw_DialogToast);
  }

  protected onInit() {
  }

  protected onShown () {
    // 同步设置
    this.view.m_toast.m_txt.text = this.extra.text;
    this.view.m_pos_state.selectedIndex = this.extra.pos;
  }
}
