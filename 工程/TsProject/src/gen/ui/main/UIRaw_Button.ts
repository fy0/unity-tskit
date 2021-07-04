/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_Button extends FairyGUI.GButton {

	public m_color_state: FairyGUI.Controller;
	public static URL: string = "ui://j8b2cwkbaemq6";

	public static createInstance<T extends UIRaw_Button>(): T {
		const obj = <UIRaw_Button>(FairyGUI.UIPackage.CreateObject("main", "Button"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_color_state = this.GetControllerAt(1);
	}
}