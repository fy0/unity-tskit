# unity-tskit



这是一个unity项目脚手架，采用的技术方案如下：

* Unity 2019/2020 lts
* TypeScript 脚本(puerts) - 1.0.13
* FairlyGUI 界面 - 4.2.0



提供以下特性：

* 快速开始一个项目
* 合理的目录划分，适用于高效工作流程






目录结构：

* 工程 - 主要面向开发，建议使用git进行版本管理
  * UnityProject 主项目
  * TsProject 脚本项目
  * UIProject 界面项目
* 资源 - 主要面向策划和美术，使用svn进行版本管理
  * UI资源
  * 策划文档
  * 创意
  * 故事文案
  * 美术资源
  * 音乐音效



FairyGUI 目录:

UnityProject\Assets\Vendors\FairyGUI



Puerts 目录：

UnityProject\Assets\Vendors\Puerts

考虑到v8的体积问题，这里不打包v8的二进制文件。



自行去puerts的release页面下载一个v8，例如我们使用1.0.13版本，下载这个：

https://github.com/Tencent/puerts/releases/tag/v1.0.13

压缩包里只有一个Plugins目录，覆盖至本地 UnityProject\Assets\Plugins 即可。

