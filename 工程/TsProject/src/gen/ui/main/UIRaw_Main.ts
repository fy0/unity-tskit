/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UIRaw_PageHome from "./UIRaw_PageHome";
import UIRaw_PageGame from "./UIRaw_PageGame";
import UIRaw_ButtonIcon from "./UIRaw_ButtonIcon";

import { FairyGUI } from "csharp";

export default class UIRaw_Main extends FairyGUI.GComponent {

	public m_page_state: FairyGUI.Controller;
	public m_home: UIRaw_PageHome;
	public m_game: UIRaw_PageGame;
	public m_btnSetting: UIRaw_ButtonIcon;
	public static URL: string = "ui://j8b2cwkb7oxo3";

	public static createInstance<T extends UIRaw_Main>(): T {
		const obj = <UIRaw_Main>(FairyGUI.UIPackage.CreateObject("main", "Main"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_page_state = this.GetControllerAt(0);
		this.m_home = <UIRaw_PageHome>(this.GetChildAt(0));
		this.m_game = <UIRaw_PageGame>(this.GetChildAt(1));
		this.m_btnSetting = <UIRaw_ButtonIcon>(this.GetChildAt(2));
	}
}