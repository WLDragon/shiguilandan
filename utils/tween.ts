/// 核心源码借鉴：https://github.com/CreateJS/TweenJS

interface IEase {
  (t: number): number
}

/**
 * 缓动函数枚举，更多参考 https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 */
const Ease = {
  linear: function (t: number) {
    return t
  },
  backIn: function (t: number) {
    return t * t * ((1.7 + 1) * t - 1.7)
  },
  backOut: function (t: number) {
    return (--t * t * ((1.7 + 1) * t + 1.7) + 1)
  },
  sineIn: function (t: number) {
    return 1 - Math.cos(t * Math.PI / 2)
  },
  sineOut: function (t: number) {
    return Math.sin(t * Math.PI / 2)
  }
}

class TweenItem {
  props: { [x in string] }
  duration: number
  ease: IEase

  propsOriginValue: { [x in string] }
  start: number = 0

  constructor(props: Object, duration: number, ease: IEase) {
    this.duration = duration
    this.props = props
    this.ease = ease
  }
}

interface ITween {
  /**
   * 指定属性缓动到目标值
   * @param props 目标属性
   * @param duration 执行时长，毫秒
   * @param ease 缓动函数
   */
  to(props: Object, duration?: number, ease?: IEase): ITween
  /**
   * 等待一段时间再执行
   * @param duration 时长，毫秒
   */
  wait(duration: number): ITween
  /**缓动结束后执行的方法（每个循环都会执行一次） */
  onComplete(call: Function): ITween
  /**在所有循环都结束后执行的方法，如果循环只有一次与onComplete效果一样，无限循环不会触发 */
  onAllComplete(call: Function): ITween
  /**缓动过程回调函数 */
  onChange(call: Function): ITween

  /**清空所有设置，自动释放内存 */
  clear(): ITween

  /**停止，如果没有外部引用将会被回收内存 */
  stop(): void
  /**停止后如果有外部引用，可以重新开始 */
  resume(): void
}

class TweenObject implements ITween {
  target: any
  isStoped: boolean
  loopTimes: number
  loopIndex: number = 0
  change: Function
  complete: Function
  allComplete: Function
  itemIndex: number = 0
  tweenItems: TweenItem[] = []

  constructor(target: any, loopTimes: number) {
    this.target = target
    this.loopTimes = loopTimes
  }

  to(props: Object, duration: number = 0, ease: IEase = Ease.linear) {
    this.tweenItems.push(new TweenItem(props, duration, ease))
    this.resume()
    return this
  }

  wait(duration: number) {
    this.tweenItems.push(new TweenItem(null, duration, null))
    this.resume()
    return this
  }

  onComplete(call: Function) {
    this.complete = call
    return this
  }

  onAllComplete(call: Function) {
    this.allComplete = call
    return this
  }

  onChange(call: Function) {
    this.change = call
    return this
  }

  clear(): ITween {
    this.isStoped = true
    this.itemIndex = 0
    this.loopIndex = 0
    this.tweenItems.length = 0
    this.change = null
    this.complete = null
    this.allComplete = null
    return this
  }

  stop(): void {
    this.isStoped = true
  }

  resume(): void {
    this.isStoped = false
    if (!tweening.includes(this)) {
      tweening.push(this)
    }
  }
}

let tweening: TweenObject[] = []

/**
 * 移除所有的动画
 */
function removeAllTweens() {
  tweening.forEach(tobj => tobj.clear())
}

/**
 * 简易动画补间工具
 * @param target 应用的目标对象
 * @param loopTimes 循环次数，为0时无限循环，默认值为1
 */
function tween(target: any, loopTimes: number = 1): ITween {
  if (loopTimes < 0) {
    throw Error('loopTimes must be >= 0')
  }

  return new TweenObject(target, loopTimes)
}

// Basic lerp funtion.
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}

function step(tobj: TweenObject, now: number) {

  let item = tobj.tweenItems[tobj.itemIndex]

  if (item.start == 0) {
    item.start = now
    //初始化原始值，如果使用wait方法props为null
    if (item.props) {
      item.propsOriginValue = {}
      for (let k in item.props) {
        item.propsOriginValue[k] = tobj.target[k]
      }
    }
  }

  //执行缓动过程
  let phase = 1
  if (item.duration > 0) {
    phase = Math.min(1, (now - item.start) / item.duration)
  }
  if (item.props) {
    for (let k in item.props) {
      tobj.target[k] = lerp(item.propsOriginValue[k], item.props[k], item.ease(phase))
    }
    if (tobj.change) {
      tobj.change()
    }
  }

  //缓动结束
  if (phase === 1) {
    tobj.itemIndex++
    if (tobj.itemIndex >= tobj.tweenItems.length) {

      if (tobj.complete) {
        tobj.complete()
      }

      tobj.itemIndex = 0

      if (tobj.loopTimes == 0) { //无限循环
        tobj.tweenItems.forEach(m => m.start = 0)

      } else {
        tobj.loopIndex++
        if (tobj.loopIndex == tobj.loopTimes) {
          if (tobj.allComplete) {
            tobj.allComplete()
          }
          tobj.stop()
          tobj.loopIndex = 0
          tobj.tweenItems.length = 0

        } else {
          tobj.tweenItems.forEach(m => m.start = 0)
        }
      }
    }
  }
}

/**帧循环 */
function tick() {
  if (tweening.length) {
    //有动画时每帧都会检查是否有移除，所以用remove数组记录可以减少循环次数
    let remove: TweenObject[] = []
    let now = Date.now()

    for (let i = 0; i < tweening.length; i++) {
      let tobj = tweening[i]

      if (tobj.isStoped) {
        remove.push(tobj)

      } else if (tobj.tweenItems.length) {
        step(tobj, now)
      }
    }

    //移除缓动结束的tween
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1)
    }
  }

  window.requestAnimationFrame(tick)
}

window.requestAnimationFrame(tick)

export { tween, Ease, removeAllTweens, ITween }