/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_Toast extends FairyGUI.GComponent {

	public m_txt: FairyGUI.GTextField;
	public static URL: string = "ui://j8b2cwkbv44rr";

	public static createInstance<T extends UIRaw_Toast>(): T {
		const obj = <UIRaw_Toast>(FairyGUI.UIPackage.CreateObject("main", "Toast"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_txt = <FairyGUI.GTextField>(this.GetChildAt(1));
	}
}