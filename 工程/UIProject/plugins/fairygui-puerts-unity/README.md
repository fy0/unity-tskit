# fairygui-puerts-unity


## 介绍

FairyGUI插件，用于在Unity+Puerts场景接入FairyGUI。

生成TypeScript代码绑定来替代原本的CS绑定。


注：

Puerts：https://github.com/Tencent/puerts

腾讯出品的TypeScript游戏引擎绑定，它能让你使用TS这门语言来作为游戏的脚本语言。

FairyGUI：https://www.fairygui.com

超强UI编辑器，跨平台开源UI解决方案。

## 为什么要用这个插件？

### 1. 一键起步，一刀999

无论是Unity3D，Puerts还是FairyGUI，都是非常出色的项目。如果你刚刚上手，希望把他们结合起来一起使用，这个插件和这份说明可以给你有力的帮助。

### 2. 优化热更新

FairyGUI 在项目类型为 Unity 时，会生成 C# 代码文件，这些文件参与编译之后UI才能运作起来。

如果我们要对游戏进行热更并改动界面，这样就需要对 C# 部分进行热更，处理起来极其麻烦。

但是脚本热更起来就很方便，如果说 FairyGUI 可以只生成 TS 文件，就可以避免改界面也要 C# 热更了。

### 3. 只写一种代码

不用在C#和TS代码中切来切去了。


## 如何使用？

### 其一：FairyGUI 部分

将本项目clone为`你的fairygui工程目录/plugins/fairygui-puerts-unity`

重新加载项目。

### 其二：Unity 部分

（以下内容根据官方文档 https://www.fairygui.com/docs/guide/unity/puerts.html）

1. 在Unity编辑器的Scripting Define Symbols里增加 FAIRYGUI_PUERTS

2. 在你的PuertsConfig.cs中加入FairyGUI的绑定内容，这里给出一个完整示例：

```cs
// Assets/Editor/PuertsConfig.cs
using System.Collections.Generic;
using Puerts;
using System;
using System.Linq;
using System.Reflection;
using UnityEngine;

//1、配置类必须打[Configure]标签
//2、必须放Editor目录
[Configure]
public class ExamplesCfg
{
    [Binding]
    static IEnumerable<Type> Bindings
    {
        get
        {
            return new List<Type>() {
                typeof(Debug),
                typeof(Vector3),
                typeof(List<int>),
                typeof(Dictionary<string, List<int>>),
                typeof(Time),
                typeof(Transform),
                typeof(Component),
                typeof(GameObject),
                typeof(UnityEngine.Object),
                typeof(Delegate),
                typeof(System.Object),
                typeof(Type),
                typeof(ParticleSystem),
                typeof(Canvas),
                typeof(RenderMode),
                typeof(Behaviour),
                typeof(MonoBehaviour),
            };
        }
    }


    [Binding]
    static IEnumerable<Type> BindingsGame
    {
        get
        {
            var result = new List<Type>();
            List<string> namespaces = new List<string>()
            {
                "FairyGUI",
                "FairyGUI.Utils",
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

    static bool IsExcluded(Type type)
    {
        if (Attribute.IsDefined(type, typeof(ObsoleteAttribute)))
        {
            return true;
        }
        if (type.GetCustomAttributes(typeof(System.ObsoleteAttribute), true).Length > 0)
        {
            return true;
        }
        return false;
    }

    [BlittableCopy]
    static IEnumerable<Type> Blittables
    {
        get
        {
            return new List<Type>()
            {
                //打开这个可以优化Vector3的GC，但需要开启unsafe编译
                //typeof(Vector3),
            };
        }
    }

    [Filter]
    static bool FilterMethods(System.Reflection.MemberInfo mb)
    {
        // 排除 MonoBehaviour.runInEditMode, 在 Editor 环境下可用发布后不存在
        if (mb.DeclaringType == typeof(MonoBehaviour) && mb.Name == "runInEditMode") {
            return true;
        }
        return false;
    }
}
```

弄好之后生成一次puerts的代码。

### 其三：在TypeScript中加载UI

`UIPackage.AddPackage` 和 `FairyGUI.GRoot.inst.AddChild` 都是常见用法，就不详细解说了。

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
  FairyGUI.GRoot.inst.AddChild(ui);
}
```

可以看到UI显示了出来，点击事件也被触发，大功告成。

## 鸣谢

* 官方插件模板。完成度本身就极高，我只做了一点微小的工作。

* [FairyGUI_GenCode_Lua](https://gitee.com/code_now/FairyGUI_GenCode_Lua) 项目，给了我一些参考，同时指路让我去看官方GenCode。

* [Geequlim](https://github.com/Geequlim) 大佬，他写了一个 [unity puerts 项目模板](https://github.com/Geequlim/puerts-starter-kit)，我从他那里得知存在这样一种方案，因此得以选择这个技术路线。
