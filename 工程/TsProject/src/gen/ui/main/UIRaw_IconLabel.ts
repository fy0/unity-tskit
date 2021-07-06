/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_IconLabel extends FairyGUI.GLabel {

	public m_type_state: FairyGUI.Controller;
	public static URL: string = "ui://j8b2cwkbi7x2j";

	public static createInstance<T extends UIRaw_IconLabel>(): T {
		const obj = <UIRaw_IconLabel>(FairyGUI.UIPackage.CreateObject("main", "IconLabel"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_type_state = this.GetControllerAt(0);
	}
}