import { FairyGUI } from "csharp";
import UIRaw_DialogStoryChoices from "../../../gen/ui/main/UIRaw_DialogStoryChoices";
import UIRaw_StoryChoicesItem from "../../../gen/ui/main/UIRaw_StoryChoicesItem";
import { UIDialog } from "./UIDialog";

export class DialogStoryChoices extends UIDialog<UIRaw_DialogStoryChoices> {
  items: string[] = [];
  waitResolve: (value: number | PromiseLike<number>) => void;

  constructor() {
    super(UIRaw_DialogStoryChoices);
  }

  protected onInit() {
    this.view.m_list.itemRenderer = (index: number, item: UIRaw_StoryChoicesItem) => {
      item.data = index;
      item.text = this.items[index];
    }

    this.view.m_list.onClickItem.Set((ctx: FairyGUI.EventContext) => {
      if (this.waitResolve) {
        this.waitResolve(ctx.data.data);
      }
      this.waitResolve = null;
      this.hide();
    });
  }

  waitClickItem (): Promise<number> {
    return new Promise((resolve) => {
      this.waitResolve = resolve;
    });
  }

  protected onShown () {
    // 同步设置
    this.modal = true;
    this.items = this.extra as string[];
    this.view.m_list.numItems = this.items.length;
  }
}
