# a-long-story

在本以为会发现可憎之物的地方，我们见到了神衹；在本以为会杀死另一个人的地方，我们杀死了自己；在本以为会向外远游的地方，我们来到了自我存在的核心；在本以为孑然一身的地方，我们却与全世界在一起。




## 关于框架的说明

#### 1. 先进行一个项目的启动运行

这个框架采用标准的前端项目结构。即src目录存放代码，使用npm/yarn进行包管理，eslint进行代码风格的规范。

不过即使不明白这些也不要紧，打开项目路径，用命令行运行：

```cmd
npm run install
npm run dev
```

就可以了。

如果是第二次打开项目，只运行 `npm run dev` 即可。

这里会自动进行ts代码的持续编译，每当代码文件发生变动，都会自动编译。同时输出一行：

```shell
🔨 Built in XXms.
```

一般这个过程是感知不到的，esbuild作为编译器确实比tsc要快很多。



#### 2. 目录结构

接下来我们来看目录结构。代码都在src中，所以这里说的都是src的子目录，如`core`指 `src/core`：



* **index.ts** - 入口点

  

* **gen** - 存放自动生成的文件，例如策划配表的生成结果，fgui自动生成的绑定文件

  

* **types** - 存放.d.ts文件

  

* **utils** - 存放一些跟游戏核心玩法关系不是太大的代码，例如数学算法。

  

* **core**

  这里存放框架的核心类型。`event.ts`是一个事件系统。而`object.ts`则是基本对象。每一个基本对象(SObject)上都会挂一个用于发事件的`Emitter`，同时还封装了一些实用方法。

  

* **game**

  游戏的玩法和逻辑核心。这个目录下的`game.ts`存放着整个游戏中最重要的Game类。这个类在一些游戏引擎中的等价叫法为`Application`、`World`。

  同时，Game对象应该是整个游戏中最重要的单例（也可能是唯一单例）。

  使用下面这句代码获取其实例对象，这个短句会频繁用到，所以请牢记：

  ```typescript
  Game.inst
  ```

  

  我们看一下game目录的子目录：

  * **game/base** 

    这个目录之于game就等于是 `core` 目录之于整个项目。

  * **game/modules**

    非常重要。如果说**Game**是骨，那么**modules**是肉。许多功能都使用**modules**来实现，他们会被创建为**Game**的属性，很容易被访问到：

    ```typescript
    const game = Game.inst;
    
    // 2000ms 后弹出一个对话框
    game.task.delay(2000, () => {
        // 注：puerts早期没有setTimeout和setInterval这两个API，所以自己做了一个实现。
        // 使用最小堆队列+时间轮算法，效率非常高。
        DialogConfirm.show();
    });
    
    // 剧情对话
    await game.story.tell('开发者你好');
    await game.story.tell('欢迎使用 tskit 框架');
    
    await game.story.tell('先采访一下你为什么使用这个框架');
    switch (await game.story.choices(['做游戏', '就是玩儿', '首先，我要试一下'])) {
        case 0:
            await game.story.tell('欢迎大佬。');
            break;
        case 1:
            await game.story.tell('_(¦3」∠)_');
            break;
        case 2:
            await game.story.tell('多试试，非常好用！');
            break;
    }
    
    await game.story.tell('在正式使用之前， [b][color=#ff0000]强烈建议[/color][/b]先阅读此文档');
    await game.story.tell('祝你顺利。');
    game.story.hide();
    
    // 背包
    game.inventory.earn({ 'cash': 100, 'repute': 10 }); // 玩家获得了100块钱和10点声望
    
    if (game.inventory.canCost({ 'cash': 100 })) {  // 如果玩家有100块钱
      game.inventory.cost({ 'cash': 100 }); // 玩家花掉了100块钱    
    }
    
    // 打开游戏游玩界面
    game.ui.openPageGame();
    ```

    剩下的模块可以自行去读代码，有些模块的开始部分用注释写着文档和使用方法。

  * **game/plugins**

    这个目录放一些与游戏机制有关的类，例如单位、属性、动作、攻击判定、buff等等。可用可不用。

  * **game/scenes**

    场景目录。

  * **game/ui**

    另一个非常重要的目录。这里面的类都是对fgui自动生成类的二次封装，用于绑定事件等操作。

    如果你希望对一个fgui组件进行事件的绑定、状态的更新，或者其他操作，那么在这里创建一个文件继承原始类（如`UIRaw_Main`），写法参考现有文件即可。随后在UIManager这个模块中进行把你写的类加入到绑定列表。

    Dialog同样如此，不过不用加入绑定列表。

  

  





