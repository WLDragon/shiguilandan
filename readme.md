# 《是鬼烂但》源码

## 声明

* 本源码版权归**广州半桶网络科技有限公司**，只能参考学习，不可转售。

* 项目中的代码可以复制到自己的项目中使用，但图片资源不能用于商业目的。

* 配乐来自于[爱给网](https://www.aigei.com/music/)的CC0许可协议音频。

## 运行

* 安装node.js环境，下载源码后打开控制台进入项目根目录，执行`npm install`安装依赖，然后`npm run dev`，在浏览器访问输出的地址即可

* PC浏览器使用WASD按键移动方向，鼠标点击控件

* 移动端浏览器使用虚拟摇杆/按键移动方向

## 编辑器

* 代码编辑器：[Visual Studio Code](https://code.visualstudio.com/)

* 地图编辑器：[Tiled Editor](https://www.mapeditor.org/)

* 数据编辑器：[WPS Office](https://www.wps.cn/) 的表格（编辑_assist/config/*.xml）

## Npm 脚本

* npm run dev: 调试

* npm run image: 生成开发环境用的加载图片的代码

* npm run data: 打包配置数据到`public/assets/config.bin`

* npm run map: 打包地图数据到`public/scenes.bin`

* npm run mp3: 打包音频文件到`public/sound.bin`

## 构建生产版本

构建生产环境的版本需要使用工具把_assist/images里的图片打包成图集sprites.png(sprites.json)，然后放到public/assets里

使用vite的build指令构建版本

* 开源图集工具：[ShoeBox](http://renderhjs.net/shoebox/)

* 开发和构建工具：[Vite](https://vitejs.dev/)

## 工程结构说明

**_assist** 为辅助工具，用于产出游戏中需要的资源

**component**、**game**、**model** 三个目录与游戏内容相关

**其他目录** 为工具类，一般不需要改动

```
├── _assist 辅助工具，存放开发环境图片资源以及一些node.js脚本
    ├── config 配置文件
        ├── i18n_text.xml 对话文本
        ├── i18n_ui.xml UI文字，例如按钮文本`确定`等
    ├── images 开发时用的图片，生产环境需要用ShoeBox打包到public/assets
    ├── maps 包含地图工程源码，以及打包脚本
    ├── sounds 声音及打包脚本
    ├── backdoor.ts 用于开发时调整数据的后门代码
    ├── data.ts 打包压缩config里的文件并输出到public/assets/config.bin
    ├── imageDebug.ts 开发环境加载图片的代码，自动生成，不能修改
    ├── imageDebugCreate.ts 生成开发环境用到于加载图片的脚本

├── binary
    ├── ByteReader.ts 二进制数据读取器
    ├── ByteWriter.ts 二进制数据写入器
    ├── serialization.ts 序列化和反序列化js对象

├── component oixi组件
    ├── Home.ts
    ├── ...

├── game 游戏逻辑代码
    ├── app.ts 全局快捷入口，提供一些类的快捷访问方法
    ├── constant.ts 存放常量，可以供emitter使用
    ├── database.ts 游戏数据库
    ├── dataSave.ts 全局存档数据，记录存档位索引和声音开关等设置
    ├── dataTemp.ts 全局内存数据，不会保存到数据库中
    ├── debug.ts 模拟安卓原生环境接口，用于开发调试
    ├── routerConfig.ts 路由配置
    ├── ...

├── model 定义数据表结构
    ├── notype 存放不需要确定字段类型的数据结构
    ├── Common.ts 游戏选项数据，例如难易程度、剧本等
    ├── ...

├── native 与原生环境对接的工具
    ├── h2n.ts h5向原生发送消息
    ├── n2h.ts 接收原生发送的消息

├── public 直接复制到生产环境的资源
    ├── assets 图片和数据资源
    ├── js
        ├── pixi.min.js //渲染引擎
        ├── pako.min.js //二进制数据压缩工具

├── utils 工具类
    ├── emitter.ts 全局消息发送工具
    ├── i18n.ts 本地化管理类
    ├── layout.ts 相对位置布局工具
    ├── math.ts 数学函数的别名，避免出现大量Math.*
    ├── others.ts 数组排序等杂乱工具
    ├── router.ts 路由管理工具
    ├── shake.ts 抖动元素
    ├── sound.ts 播放器
    ├── tween.ts 实现补间动画的工具类

├── index.html vite入口文件

├── main.ts 程序入口文件
```

## 移动端体验地址

* [TapTap](https://l.tapdb.net/UvqbJezw?channel=rep-rep_atfw5wtjcqh)

* [谷歌商店](https://play.google.com/store/apps/details?id=fun.bantong.game4.g)

* [苹果商店](https://apps.apple.com/cn/app/id6446050718)

* [好游快爆](https://www.3839.com/a/150965.htm)

* [4399游戏盒](http://a.4399.cn/game-id-257924.html)

## 移动源码说明

* Android和iOS都是只使用了WebView组件，需要了解原生开发，使用WebView作壳打包app。
