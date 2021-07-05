# fairygui-puerts-unity


## 介绍

FairyGUI插件，用于在Unity+Puerts场景接入FairyGUI。

生成TypeScript代码绑定来替代原本的CS绑定。


注：

Puerts：https://github.com/Tencent/puerts

腾讯出品的TypeScript游戏引擎绑定，它能让你使用TS这门语言来作为游戏的脚本语言。

FairyGUI：https://www.fairygui.com

超强UI编辑器，跨平台开源UI解决方案。

## 使用

### 准备工作！

首先确保你有一个带puerts的unity项目和一个FGUI工程存在。

### 其一：FairyGUI 配置部分

将本项目clone为`你的fairygui工程目录/plugins/fairygui-puerts-unity`

重新加载项目。

### 其二：Unity 配置部分

（以下内容根据官方文档 https://www.fairygui.com/docs/guide/unity/puerts.html）

1. 在Unity编辑器的Scripting Define Symbols里增加 FAIRYGUI_PUERTS

2. 在你的PuertsConfig.cs中加入FairyGUI的绑定内容，这里给出Bindings下的一段示例：

```cs
// Assets/Editor/PuertsConfig.cs

[Binding]
static IEnumerable<Type> Bindings
{
    get
    {
        var result = new List<Type>(){ ..... }

        // 从这部分开始！
        List<string> namespaces = new List<string>()
        {
            "FairyGUI",
            "FairyGUI.Utils",
            "game"
        };

        Assembly[] ass = AppDomain.CurrentDomain.GetAssemblies();
        result.AddRange((from assembly in ass
            where !(assembly.ManifestModule is System.Reflection.Emit.ModuleBuilder)
            from type in assembly.GetExportedTypes()
            where type.Namespace != null && namespaces.Contains(type.Namespace) && (!IsExcluded(type))
                    && type.BaseType != typeof(MulticastDelegate) && !type.IsEnum
            select type));

        return result;
    }
}
```

弄好之后生成一次puerts的代码。

### 其三：在TypeScript中使用

```typescript
import { FairyGUI } from 'csharp';
import UI_page_main from '../views/ui/bind/main/UI_page_main';

function main () {
  FairyGUI.UIPackage.AddPackage("FairyGUI-dist/main");

  class UIPageMain extends UI_page_main {
    onConstruct () {
      super.onConstruct();

      this.m_btn_start.onClick.Add(() => {
        console.log('Hello World!');
      });
    }
  }

  const ui = UIPageMain.createInstance();

  // 注：这里的1600, 900为UI项目设计分辨率
  GRoot.inst.SetContentScaleFactor(1600, 900);
  FairyGUI.GRoot.inst.AddChild(ui);
}
```

可以看到UI显示了出来，点击事件也被触发，大功告成。


## 更新

### version 1.1 - 20210705

* 适配至 FairyGUI-unity 4.2.0，不再支持4.1.0
* 优化API易用性（bind、createInstance）



### version 1.0 - 20210425

* 初版，支持版本为 FairyGUI-unity 4.1.0 - 1ad0b92 （注意不是4.1.0版本，而是4.1.0之后的第二个commit）



## 鸣谢

* 官方插件模板。完成度本身就极高了，我只是增补。

* [FairyGUI_GenCode_Lua](https://gitee.com/code_now/FairyGUI_GenCode_Lua) 项目。

* [Geequlim](https://github.com/Geequlim) 大佬，思路参考自 [unity puerts 项目模板](https://github.com/Geequlim/puerts-starter-kit)。
