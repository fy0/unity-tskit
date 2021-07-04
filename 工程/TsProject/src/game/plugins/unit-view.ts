import { game, UnityEngine } from "csharp";
import { autorun, makeObservable, observable, when } from "mobx";
import { $typeof } from "puerts";
import { SObject } from "../../core/object";
import { Unit } from "./unit";

export class UnitView extends SObject {
  @observable
  unit: Unit;

  // view: game.UnitView;

  constructor() {
    super();

    autorun(() => {
      if (this.unit) {
        this.createView();
      }
    })

    makeObservable(this);
  }

  createView() {
    // const prefab = UnityEngine.Resources.Load('units/testUnit');
    // const a = UnityEngine.GameObject.Instantiate(prefab, new UnityEngine.Vector3(0,0,0), UnityEngine.Quaternion.Euler(0,0,0)) as UnityEngine.GameObject;
    // a.SetActive(true);
    // this.view = a.GetComponent($typeof(game.UnitView)) as game.UnitView;
    // a.transform.parent = anchor.transform;
  }
}
