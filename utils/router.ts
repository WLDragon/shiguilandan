import { Container, DisplayObject } from "pixi.js";

export interface IRouter extends DisplayObject {
  /**
   * 创建路由组件时执行
   */
  created?(): void
  /**
   * 通过to方法进入时执行
   * @param param 附带参数
   */
  actived?(param?: any): void
  /**
   * 通过back方法进入时执行
   */
  reactived?(lastRoute?: string): void
  /**
   * 离开时执行
   */
  deactived?(): void

  /**销毁，清除事件监听 */
  beforeDestroy?(): void
}

let historys: string[] = []
let routeCache: { [a in string]: IRouter } = {}

let root: Container
let routeConfigs: { [a in string]: () => IRouter }
let currentComponent: IRouter

/**
 * 初始化组件定义
 * @param app 
 * @param routes 记录构建组件的函数及需要加载的资源路径
 */
export function initRouter(container: Container, config: { [a in string]: () => IRouter }) {
  routeConfigs = config
  root = container
}

/**
 * 重置路由
 * 场景：例如在切换语言后需要重新实例化另一个语言的界面
 */
export function resetRouter() {
  currentComponent = null

  for (let k in routeCache) {
    let r = routeCache[k]
    if (r.beforeDestroy) {
      r.beforeDestroy()
    }
    (r as Container).destroy({ children: true })
  }
  routeCache = {}
  clearHistorys()
}

export function clearHistorys() {
  historys = []
}

/**
 * 打开一个组件界面
 * 避免在生命周期钩子里调用，以免造成混乱
 * @param name 组件名
 * @param param 传入组件actived方法的参数
 */
export function to(name: string, param?: Object) {
  if (historys.length && name == historys[historys.length - 1]) {
    //再次进入当前路由
    let comp: IRouter = routeCache[name]
    if (comp.actived) {
      comp.actived(param)
    }
    return
  }

  let comp: IRouter = routeCache[name]
  if (!comp) {
    let route = routeConfigs[name]
    if (!route) {
      throw Error('no route: ' + name)
    }

    comp = route()
    routeCache[name] = comp
    if (comp.created) {
      comp.created()
    }
  }

  root.addChild(comp)
  historys.push(name)

  if (process.env.NODE_ENV == 'development') {
    let pm = param ? '?param=' + JSON.stringify(param) : ''
    let path = `index.html#${name}${pm}`
    window.history.replaceState(null, '', path)
  }

  if (currentComponent) {
    root.removeChild(currentComponent)
    if (currentComponent.deactived) {
      currentComponent.deactived()
    }
  }
  if (comp.actived) {
    comp.actived(param)
  }
  currentComponent = comp
}

/**
 * 返回到上一个打开过的组件界面，会触发reactived方法
 * 避免在生命周期钩子里调用，以免造成混乱
 */
export function back() {
  if (historys.length > 1) {
    //移除当前路径
    let lastRoute = historys.pop()
    let name = historys[historys.length - 1]
    let comp = routeCache[name]

    root.addChild(comp)
    root.removeChild(currentComponent)

    if (process.env.NODE_ENV == 'development') {
      let path = `index.html#${name}`
      window.history.replaceState(null, '', path)
    }

    if (currentComponent.deactived) {
      currentComponent.deactived()
    }
    if (comp.reactived) {
      comp.reactived(lastRoute)
    }
    currentComponent = comp
  }
}