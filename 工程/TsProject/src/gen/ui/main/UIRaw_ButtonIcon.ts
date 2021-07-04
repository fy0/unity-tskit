/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_ButtonIcon extends FairyGUI.GButton {

	public m_bg_state: FairyGUI.Controller;
	public static URL: string = "ui://j8b2cwkb7n7qe";

	public static createInstance<T extends UIRaw_ButtonIcon>(): T {
		const obj = <UIRaw_ButtonIcon>(FairyGUI.UIPackage.CreateObject("main", "ButtonIcon"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_bg_state = this.GetControllerAt(1);
	}
}