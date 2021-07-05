import UIRaw_Main from "../../gen/ui/main/UIRaw_Main";
import { DialogSetting } from "./dialogs/UIDialogSetting";

export class UIMain extends UIRaw_Main {
  onConstruct () {
    super.onConstruct();

    this.m_btnSetting.onClick.Set(() => {
      DialogSetting.show();
    });
  }
}
