import { FairyGUI } from 'csharp';
import { GameModule } from '../base/game-module';
import { DialogStoryBox } from '../ui/dialogs/UIDialogStoryBox';
import { DialogStoryChoices } from '../ui/dialogs/UIDialogStoryChoices';
import { DialogToast } from '../ui/dialogs/UIDialogToast';

export class StoryManager extends GameModule {
  waitNext: ((value: any) => void)[] = [];
  protected storyBox: DialogStoryBox;
  private _curTellTypingEffect: FairyGUI.TypingEffect;

  init () {
    this.storyBox = DialogStoryBox._create() as DialogStoryBox;

    this.storyBox.ev.on('init', () => {
      this.storyBox.view.m_btnClose.onClick.Set(() => {
        if (this._curTellTypingEffect && this._curTellTypingEffect.Print()) {
          // 快进到显示全部
          this._curTellTypingEffect.PrintAll(0);
        } else {
          for (let i of this.waitNext) {
            i(null);
          }
          this.waitNext.length = 0;
        }
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

  /**
   * 说一句话，允许ubb代码
   * @param text 输出文本
   * @param printInterval 字符输出间隔
   * @returns 
   */
  tell (text: string, printInterval = 0.05): Promise<any> {
    DialogStoryBox.show();
    this.storyBox.view.m_content.text = text;

    const te = new FairyGUI.TypingEffect(this.storyBox.view.m_content)
    te.Start();
    te.PrintAll(printInterval);
    this._curTellTypingEffect = te;

    return new Promise((resolve) => {
      this.waitNext.push(resolve);
    });
  }

  private toastCount = 0;

  /**
   * 显示一个文本通知条，持续一段时间。
   * @param text 文本内容
   * @param duration 持续时间
   * @param pos 位置 0 为下方，1为上方
   * @returns Promise对象，在到达duration后返回
   */
  toast (text: string, duration = 1000, pos=0) {
    DialogToast.show({
      modal: false,
      extra: {
        pos,
        text,
        duration
      }
    });

    return new Promise((resolve) => {
      if (duration < 10) {
        resolve(null);
      } else {
        this.toastCount += 1;
        this.game.task.delay(duration, () => {
          this.toastCount -= 1;
          if (this.toastCount === 0) {
            DialogToast.hide();
          }
          resolve(null);
        });
      }
    });
  }

  hide() {
    DialogStoryBox.hide();
  }

  show() {
    DialogStoryBox.show();
  }
}
