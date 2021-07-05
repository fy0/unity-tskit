"use strict";
exports.__esModule = true;
var csharp_1 = require("csharp");
var CodeWriter_1 = require("./CodeWriter");
function genCode(handler, isPuerts) {
    if (isPuerts === void 0) { isPuerts = true; }
    var settings = handler.project.GetSettings("Publish").codeGeneration;
    var codePkgName = handler.ToFilename(handler.pkg.name); //convert chinese to pinyin, remove special chars etc.
    var exportCodePath = handler.exportCodePath + '/' + codePkgName;
    var namespaceName = codePkgName;
    var ns = "fgui";
    var isThree = handler.project.type == csharp_1.FairyEditor.ProjectType.ThreeJS;
    if (isPuerts)
        ns = "FairyGUI";
    if (settings.packageName)
        namespaceName = settings.packageName + '.' + namespaceName;
    //CollectClasses(stripeMemeber, stripeClass, fguiNamespace)
    var classes = handler.CollectClasses(settings.ignoreNoname, settings.ignoreNoname, ns);
    handler.SetupCodeFolder(exportCodePath, "ts"); //check if target folder exists, and delete old files
    var getMemberByName = settings.getMemberByName;
    var classCnt = classes.Count;
    var writer = new CodeWriter_1["default"]({ blockFromNewLine: false, usingTabs: true });
    for (var i = 0; i < classCnt; i++) {
        var classInfo = classes.get_Item(i);
        var members = classInfo.members;
        var references = classInfo.references;
        writer.reset();
        if (isPuerts) {
            writer.writeln('/* eslint-disable */');
            writer.writeln();
        }
        var refCount = references.Count;
        if (refCount > 0) {
            for (var j = 0; j < refCount; j++) {
                var ref = references.get_Item(j);
                writer.writeln('import %s from "./%s";', ref, ref);
            }
            writer.writeln();
        }
        if (isPuerts) {
            writer.writeln('import { FairyGUI } from "csharp";');
            writer.writeln();
        }
        if (isThree) {
            writer.writeln('import * as fgui from "fairygui-three";');
            if (refCount == 0)
                writer.writeln();
        }
        writer.writeln('export default class %s extends %s', classInfo.className, classInfo.superClassName);
        writer.startBlock();
        writer.writeln();
        var memberCnt = members.Count;
        for (var j = 0; j < memberCnt; j++) {
            var memberInfo = members.get_Item(j);
            writer.writeln('public %s: %s;', memberInfo.varName, memberInfo.type);
        }
        writer.writeln('public static URL: string = "ui://%s%s";', handler.pkg.id, classInfo.resId);
        writer.writeln();
        writer.writeln('public static createInstance<T extends %s>(): T', classInfo.className);
        writer.startBlock();
        if (isPuerts) {
            writer.writeln("const obj = <" + classInfo.className + ">(" + ns + ".UIPackage.CreateObject(\"" + handler.pkg.name + "\", \"" + classInfo.resName + "\"));");
            writer.writeln("return obj as T;");
        }
        else {
            writer.writeln('return <%s>(%s.UIPackage.createObject("%s", "%s"));', classInfo.className, ns, handler.pkg.name, classInfo.resName);
        }
        writer.endBlock();
        writer.writeln();
        writer.writeln('protected onConstruct ()');
        writer.startBlock();
        if (isPuerts) {
            for (var j = 0; j < memberCnt; j++) {
                var memberInfo = members.get_Item(j);
                if (memberInfo.group == 0) {
                    if (getMemberByName) {
                        writer.writeln('this.%s = <%s>(this.GetChild("%s"));', memberInfo.varName, memberInfo.type, memberInfo.name);
                    }
                    else {
                        writer.writeln('this.%s = <%s>(this.GetChildAt(%s));', memberInfo.varName, memberInfo.type, memberInfo.index);
                    }
                    //if (!memberInfo.type.startsWith('FairyGUI.')) {
                    //    writer.writeln(`(this.${memberInfo.varName} as any).onConstruct();`);
                    //}
                }
                else if (memberInfo.group == 1) {
                    if (getMemberByName)
                        writer.writeln('this.%s = this.GetController("%s");', memberInfo.varName, memberInfo.name);
                    else
                        writer.writeln('this.%s = this.GetControllerAt(%s);', memberInfo.varName, memberInfo.index);
                }
                else {
                    if (getMemberByName)
                        writer.writeln('this.%s = this.GetTransition("%s");', memberInfo.varName, memberInfo.name);
                    else
                        writer.writeln('this.%s = this.GetTransitionAt(%s);', memberInfo.varName, memberInfo.index);
                }
            }
        }
        else {
            for (var j = 0; j < memberCnt; j++) {
                var memberInfo = members.get_Item(j);
                if (memberInfo.group == 0) {
                    if (getMemberByName)
                        writer.writeln('this.%s = <%s>(this.getChild("%s"));', memberInfo.varName, memberInfo.type, memberInfo.name);
                    else
                        writer.writeln('this.%s = <%s>(this.getChildAt(%s));', memberInfo.varName, memberInfo.type, memberInfo.index);
                }
                else if (memberInfo.group == 1) {
                    if (getMemberByName)
                        writer.writeln('this.%s = this.getController("%s");', memberInfo.varName, memberInfo.name);
                    else
                        writer.writeln('this.%s = this.getControllerAt(%s);', memberInfo.varName, memberInfo.index);
                }
                else {
                    if (getMemberByName)
                        writer.writeln('this.%s = this.getTransition("%s");', memberInfo.varName, memberInfo.name);
                    else
                        writer.writeln('this.%s = this.getTransitionAt(%s);', memberInfo.varName, memberInfo.index);
                }
            }
        }
        writer.endBlock();
        writer.endBlock(); //class
        writer.save(exportCodePath + '/' + classInfo.className + '.ts');
    }
    writer.reset();
    if (isPuerts) {
        var binderName = codePkgName + 'Binder';
        for (var i = 0; i < classCnt; i++) {
            var classInfo = classes.get_Item(i);
            writer.writeln('import %s from "./%s";', classInfo.className, classInfo.className);
        }
        if (isThree) {
            writer.writeln('import * as fgui from "fairygui-three";');
            writer.writeln();
        }
        if (isPuerts) {
            // writer.writeln('import { FairyGUI } from "csharp";');
            writer.writeln('import { bind } from "./fairygui";');
            // writer.writeln('import { $typeof } from "puerts";');
        }
        writer.writeln();
        writer.writeln('export default class %s', binderName);
        writer.startBlock();
        writer.writeln('public static bindAll()');
        writer.startBlock();
        for (var i = 0; i < classCnt; i++) {
            var classInfo = classes.get_Item(i);
            if (isPuerts) {
                writer.writeln('bind(%s);', classInfo.className);
            }
            else {
                writer.writeln('%s.UIObjectFactory.setExtension(%s.URL, %s);', ns, classInfo.className, classInfo.className);
            }
        }
        writer.endBlock(); //bindall
        writer.endBlock(); //class
        writer.save(exportCodePath + '/' + binderName + '.ts');
        writer.reset();
        writer.writeln('import { FairyGUI, System } from "csharp";');
        writer.writeln("\nexport function bind(cls: new () => FairyGUI.GComponent) {\n  FairyGUI.UIObjectFactory.SetPackageItemExtension((cls as any).URL, () => {\n    const obj = new cls();\n\n    const tryBind = (actionName: string, funcName: string) => {\n      // \u5B58\u5728\u5219\u8FDB\u884C\u7ED1\u5B9A\n      if (funcName in obj && typeof obj[funcName] === 'function') {\n        obj[actionName] = new System.Action(obj[funcName].bind(obj));\n      }\n    }\n\n    tryBind('__onConstruct', 'onConstruct');\n    tryBind('__onDispose', 'onDispose');\n\n    tryBind('__onInit', 'onInit');\n    tryBind('__onShown', 'onShown');\n    tryBind('__onHide', 'onHide');\n    tryBind('__doShowAnimation', 'doShowAnimation');\n    tryBind('__doHideAnimation', 'doHideAnimation');\n\n    return obj;\n  });\n}\n");
        writer.save(exportCodePath + '/fairygui.ts');
    }
}
exports.genCode = genCode;
