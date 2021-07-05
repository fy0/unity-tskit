/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw__Frame from "./UIRaw__Frame";
import UIRaw_Button from "./UIRaw_Button";

import { FairyGUI } from "csharp";

export default class UIRaw_DialogConfirm extends FairyGUI.GComponent {

	public m_frame: UIRaw__Frame;
	public m_btnYes: UIRaw_Button;
	public m_btnNo: UIRaw_Button;
	public m_text: FairyGUI.GTextField;
	public static URL: string = "ui://j8b2cwkb7oxo5";

	public static createInstance<T extends UIRaw_DialogConfirm>(): T {
		const obj = <UIRaw_DialogConfirm>(FairyGUI.UIPackage.CreateObject("main", "DialogConfirm"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_frame = <UIRaw__Frame>(this.GetChildAt(0));
		this.m_btnYes = <UIRaw_Button>(this.GetChildAt(1));
		this.m_btnNo = <UIRaw_Button>(this.GetChildAt(2));
		this.m_text = <FairyGUI.GTextField>(this.GetChildAt(3));
	}
}