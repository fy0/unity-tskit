import { GameModule } from '../base/game-module';
import { DialogStoryBox } from '../ui/dialogs/UIDialogStoryBox';
import { DialogStoryChoices } from '../ui/dialogs/UIDialogStoryChoices';

export class StoryManager extends GameModule {
  waitNext: ((value: any) => void)[] = [];
  protected storyBox: DialogStoryBox;

  init () {
    this.storyBox = DialogStoryBox._create() as DialogStoryBox;

    this.storyBox.ev.on('init', () => {
      this.storyBox.view.m_btnClose.onClick.Set(() => {
        for (let i of this.waitNext) {
          i(null);
        }
        this.waitNext.length = 0;
      });
    });
  }

  /**
   * 提供选项，返回值为选择的项目的 index
   */
  async choices(items: string[]) {
    const d = DialogStoryChoices.show({
      modal: false,
      extra: items
    }) as DialogStoryChoices;

    return await d.waitClickItem();
  }

  /** 说一句话，允许ubb代码 */
  tell (text: string): Promise<any> {
    DialogStoryBox.show();
    this.storyBox.view.m_content.text = text;

    return new Promise((resolve, reject) => {
      this.waitNext.push(resolve);
    });
  }

  hide() {
    DialogStoryBox.hide();
  }

  show() {
    DialogStoryBox.show();
  }
}
