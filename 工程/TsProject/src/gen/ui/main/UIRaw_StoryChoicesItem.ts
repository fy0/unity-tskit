/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UIRaw_StoryChoicesItem extends FairyGUI.GButton {

	public m_bg: FairyGUI.GGraph;
	public static URL: string = "ui://j8b2cwkbv44rp";

	public static createInstance<T extends UIRaw_StoryChoicesItem>(): T {
		const obj = <UIRaw_StoryChoicesItem>(FairyGUI.UIPackage.CreateObject("main", "StoryChoicesItem"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_bg = <FairyGUI.GGraph>(this.GetChildAt(0));
	}
}