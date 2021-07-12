import UIRaw_DialogStoryBox from "../../../gen/ui/main/UIRaw_DialogStoryBox";
import { UIDialog } from "./UIDialog";

export class DialogStoryBox extends UIDialog<UIRaw_DialogStoryBox> {
  constructor() {
    super(UIRaw_DialogStoryBox);
  }

  protected onInit() {
  }

  protected onShown () {
    // 同步设置
  }
}
