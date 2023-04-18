import { setTextDefaultStyle } from 'oixi2'
import { Application, utils, settings, SCALE_MODES } from 'pixi.js'
import { setLayoutSize } from './utils/layout'
import { to } from './utils/router';
import { WIDTH, HEIGHT, LAYER_ROUTER, LAYER_CONFIRM, LAYER_TIPS, WINDOW, COLOR_LIGHT, VERSION, setSize } from './game/constant';
import { initConfig, loadBinFile } from './game/app';

import { debugLoadImages } from './_assist/imageDebug'
import { initRecordList, initSettings } from './game/dataSaved'
import { configRouter } from './game/routerConfig';
import { initSceneData } from './game/sceneConfig';
import { registerAudio } from './utils/sound';
import './native/n2h'
import './_assist/backdoor'

// import VConsole from 'vconsole'
// new VConsole()

utils.skipHello()

//使pixi像素化显示，可以减少资源体积和减少渲染计算量
settings.SCALE_MODE = SCALE_MODES.NEAREST
settings.ROUND_PIXELS = true
//严格模式，只能使用缓存
settings.STRICT_TEXTURE_CACHE = true

//安卓手机接了第三方SDK可能会出现初始化浏览器后innerWidth为0的情况
WINDOW.onresize = init
WINDOW.onload = init

function init() {
  let w = WINDOW.innerWidth
  let h = WINDOW.innerHeight

  if (WIDTH == 0 && w != 0 && h != 0) {
    setSize(w, h)
    setLayoutSize(WIDTH, HEIGHT)
    setTextDefaultStyle({ fill: COLOR_LIGHT, fontSize: 14, fontFamily: ['sans-serif'] })

    let application = new Application({
      width: WIDTH,
      height: HEIGHT,
      sharedLoader: true,
      sharedTicker: true,
      antialias: false,
      useContextAlpha: false,
      backgroundColor: 0,
      resolution: 3
    })

    //适配ipad，两边留白
    if (h / w > 0.6) {
      let vh = w * (HEIGHT / WIDTH)
      application.view.style.width = w + 'px'
      application.view.style.height = vh + 'px';
      application.view.style.marginTop = (h - vh) / 2 + 'px'

    } else {
      application.view.style.width = w + 'px';
      application.view.style.height = h + 'px';
    }

    //初始化显示对象层
    application.stage.addChild(LAYER_ROUTER)
    application.stage.addChild(LAYER_CONFIRM)
    application.stage.addChild(LAYER_TIPS)

    //配置路由
    configRouter(LAYER_ROUTER)

    application.loader.baseUrl = './assets/'

    if (process.env.NODE_ENV == 'development') {
      debugLoadImages(application)
    } else {
      application.loader.add('sprites.json')
    }
    application.loader.add('tiles.png')

    loadBinFile('sound')
      .then(data => registerAudio(data))
      .then(() => loadBinFile('scenes'))
      .then(data => initSceneData(data))
      .then(() => loadBinFile('config'))
      .then(data => initConfig(data, application))
      .then(() => initSettings())
      .then(() => initRecordList())
      .then(() => to('Home'))

    document.body.appendChild(application.view)
  }
}

//错误收集
window.onerror = function (msg, source, line, col, err) {
  printError(err.stack)
}

window.onunhandledrejection = function (e: PromiseRejectionEvent) {
  printError(e.reason)
}

function printError(error: string) {
  let div = document.getElementById('error')
  div.innerText = VERSION + ':' + error
  div.style.display = 'block'
}