using System.Collections.Generic;
using Puerts;
using System;
using System.Linq;
using System.Reflection;
using UnityEngine;
using UnityEngine.SceneManagement;

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
            var result = new List<Type>()
            {
                typeof(Debug),
                typeof(Vector3),
                typeof(Rect),
                typeof(Quaternion),
                typeof(Resolution),
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
                typeof(SceneManager),
                typeof(Scene),
                typeof(Screen),
                typeof(Resources)
            };

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
        // ObsoleteAttribute
        // if (type.Name == FairyGUI.TreeNode)
        // {
        //     return true;
        // }
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
