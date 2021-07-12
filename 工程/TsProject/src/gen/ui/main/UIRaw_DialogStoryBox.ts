/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_DialogStoryBox extends FairyGUI.GComponent {

	public m_content: FairyGUI.GTextField;
	public m_btnClose: FairyGUI.GButton;
	public m_fx_flash: FairyGUI.Transition;
	public static URL: string = "ui://j8b2cwkbv44rn";

	public static createInstance<T extends UIRaw_DialogStoryBox>(): T {
		const obj = <UIRaw_DialogStoryBox>(FairyGUI.UIPackage.CreateObject("main", "DialogStoryBox"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_content = <FairyGUI.GTextField>(this.GetChildAt(1));
		this.m_btnClose = <FairyGUI.GButton>(this.GetChildAt(4));
		this.m_fx_flash = this.GetTransitionAt(0);
	}
}