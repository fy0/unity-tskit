/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw_ButtonIcon from "./UIRaw_ButtonIcon";

import { FairyGUI } from "csharp";

export default class UIRaw__Frame extends FairyGUI.GButton {

	public m_dragArea: FairyGUI.GGraph;
	public m_closeButton: UIRaw_ButtonIcon;
	public m_contentArea: FairyGUI.GGraph;
	public static URL: string = "ui://j8b2cwkbcx8ui";

	public static createInstance<T extends UIRaw__Frame>(): T {
		const obj = <UIRaw__Frame>(FairyGUI.UIPackage.CreateObject("main", "_Frame"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_dragArea = <FairyGUI.GGraph>(this.GetChildAt(1));
		this.m_closeButton = <UIRaw_ButtonIcon>(this.GetChildAt(2));
		this.m_contentArea = <FairyGUI.GGraph>(this.GetChildAt(4));
	}
}