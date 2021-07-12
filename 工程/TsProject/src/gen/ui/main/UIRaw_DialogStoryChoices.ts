/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_DialogStoryChoices extends FairyGUI.GComponent {

	public m_list: FairyGUI.GList;
	public static URL: string = "ui://j8b2cwkbv44ro";

	public static createInstance<T extends UIRaw_DialogStoryChoices>(): T {
		const obj = <UIRaw_DialogStoryChoices>(FairyGUI.UIPackage.CreateObject("main", "DialogStoryChoices"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_list = <FairyGUI.GList>(this.GetChildAt(0));
	}
}