/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw_Toast from "./UIRaw_Toast";

import { FairyGUI } from "csharp";

export default class UIRaw_DialogToast extends FairyGUI.GComponent {

	public m_pos_state: FairyGUI.Controller;
	public m_toast: UIRaw_Toast;
	public m_fx_flash: FairyGUI.Transition;
	public static URL: string = "ui://j8b2cwkbv44rn";

	public static createInstance<T extends UIRaw_DialogToast>(): T {
		const obj = <UIRaw_DialogToast>(FairyGUI.UIPackage.CreateObject("main", "DialogToast"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_pos_state = this.GetControllerAt(0);
		this.m_toast = <UIRaw_Toast>(this.GetChildAt(0));
		this.m_fx_flash = this.GetTransitionAt(0);
	}
}