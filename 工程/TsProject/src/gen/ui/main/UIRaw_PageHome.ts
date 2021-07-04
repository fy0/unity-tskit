/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw_Button from "./UIRaw_Button";

import { FairyGUI } from "csharp";

export default class UIRaw_PageHome extends FairyGUI.GComponent {

	public m_btnStart: UIRaw_Button;
	public m_btnExit: UIRaw_Button;
	public static URL: string = "ui://j8b2cwkbtjnt0";

	public static createInstance<T extends UIRaw_PageHome>(): T {
		const obj = <UIRaw_PageHome>(FairyGUI.UIPackage.CreateObject("main", "PageHome"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_btnStart = <UIRaw_Button>(this.GetChildAt(0));
		this.m_btnExit = <UIRaw_Button>(this.GetChildAt(1));
	}
}