import { DisplayObject } from "pixi.js"
import { remove } from './others';

let running = false
const targetList: ShakeObject[] = []

/**
 * 抖动显示对象
 * @param target 显示对象
 * @param times 抖动次数
 */
export function shake(target: DisplayObject, times: number, size: number = 10) {
  if (!targetList.find(so => so.target == target)) {
    targetList.push(new ShakeObject(target, times, size))

    if (!running) {
      running = true
      shakeTick()
    }
  }
}

function shakeTick() {
  let removeList: ShakeObject[] = []
  targetList.forEach(so => {
    so.next()
    if (so.times <= 0) {
      so.recover()
      removeList.push(so)
    }
  })

  removeList.forEach(so => {
    remove(so, targetList)
  })

  if (targetList.length) {
    setTimeout(shakeTick, 30)
  } else {
    running = false
  }
}

class ShakeObject {
  target: DisplayObject
  times: number
  size: number
  ox: number
  oy: number

  constructor(target: DisplayObject, times: number, size: number) {
    this.target = target
    this.times = times
    this.size = size
    this.ox = target.x
    this.oy = target.y
  }

  next() {
    let halfSize = this.size / 2
    let x = this.ox + Math.random() * this.size - halfSize
    let y = this.oy + Math.random() * this.size - halfSize
    this.target.position.set(x, y)
    this.times--
  }

  recover() {
    this.target.position.set(this.ox, this.oy)
  }
}