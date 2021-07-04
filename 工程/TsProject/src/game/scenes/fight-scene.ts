import { UnityEngine } from "csharp";
import { SObject } from "../../core/object";

export class FightScene extends SObject {
  // battleField: BattleField;
  // battleFieldView: BattleFieldView;

  init () {
    UnityEngine.SceneManagement.SceneManager.LoadScene('Fight');

    UnityEngine.SceneManagement.SceneManager.add_sceneLoaded((scene, mode) => {
      // this.battleField = new BattleField();
      // this.battleFieldView = new BattleFieldView(this.battleField);

      // this.battleField.attach(this.game);
      // this.battleFieldView.attach(this.game);

      // this.battleField.loadMap1();

      // a.transform.localPosition = UnityEngine.Vector3.zero;
      // console.log(111, tileGrass, a);
    });
  }
}