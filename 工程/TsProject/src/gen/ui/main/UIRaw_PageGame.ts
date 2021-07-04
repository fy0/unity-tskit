/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw_Button from "./UIRaw_Button";

import { FairyGUI } from "csharp";

export default class UIRaw_PageGame extends FairyGUI.GComponent {

	public m_btnBack: UIRaw_Button;
	public static URL: string = "ui://j8b2cwkbcx8ug";

	public static createInstance<T extends UIRaw_PageGame>(): T {
		const obj = <UIRaw_PageGame>(FairyGUI.UIPackage.CreateObject("main", "PageGame"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_btnBack = <UIRaw_Button>(this.GetChildAt(0));
	}
}