/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw_Button from "./UIRaw_Button";

import { FairyGUI } from "csharp";

export default class UIRaw_DialogSetting extends FairyGUI.GComponent {

	public m_text: FairyGUI.GTextField;
	public m_btnYes: UIRaw_Button;
	public m_btnNo: UIRaw_Button;
	public m_caption: FairyGUI.GTextField;
	public static URL: string = "ui://j8b2cwkbcx8uf";

	public static createInstance<T extends UIRaw_DialogSetting>(): T {
		const obj = <UIRaw_DialogSetting>(FairyGUI.UIPackage.CreateObject("main", "DialogSetting"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_text = <FairyGUI.GTextField>(this.GetChildAt(1));
		this.m_btnYes = <UIRaw_Button>(this.GetChildAt(2));
		this.m_btnNo = <UIRaw_Button>(this.GetChildAt(3));
		this.m_caption = <FairyGUI.GTextField>(this.GetChildAt(4));
	}
}