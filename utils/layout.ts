import { Container, Sprite } from "pixi.js"
import { round } from "./math"

let stageWidth: number = 0
let stageHeight: number = 0

/**
 * 设置相对布局的屏幕宽高
 * @param width 屏幕宽
 * @param height 屏幕高
 */
export function setLayoutSize(width: number, height: number) {
  stageWidth = width
  stageHeight = height
}

function getAbsoluteValue(value: number, referenceSize: number) {
  if (value < 1 && value > -1 && value != 0) {
    return round(referenceSize * value)
  }

  return value
}

class LayoutObject {
  target: Container
  private offsetX: number
  private offsetY: number
  private width: number
  private height: number

  constructor(t: Container, w: number, h: number) {
    this.width = w
    this.height = h
    this.target = t

    let ax = 0
    let ay = 0
    if (t.isSprite) {
      ax = (t as Sprite).anchor.x * t.width
      ay = (t as Sprite).anchor.y * t.height
    }
    this.offsetX = ax + t.pivot.x
    this.offsetY = ay + t.pivot.y
  }

  /**
   * 相对舞台顶部的距离
   * @param y
   */
  top(y: number = 0) {
    this.target.y = getAbsoluteValue(y, this.height) + this.offsetY
    return this
  }

  /**
   * 相对舞台底部的距离
   * @param y
   */
  bottom(y: number = 0) {
    let ay = getAbsoluteValue(y, this.height)
    this.target.y = this.height - (ay + this.target.height) + this.offsetY
    return this
  }

  /**
   * 相对舞台左边的距离
   * @param x
   */
  left(x: number = 0) {
    this.target.x = getAbsoluteValue(x, this.width) + this.offsetX
    return this
  }

  /**
   * 相对舞台右边的距离
   * @param x
   */
  right(x: number = 0) {
    let ax = getAbsoluteValue(x, this.width)
    this.target.x = this.width - (ax + this.target.width) + this.offsetX
    return this
  }

  /**
   * 显示对象中点相对舞台中间的距离
   * @param x
   * @param y
   */
  center(x: number = 0, y: number = 0) {
    return this.centerX(x).centerY(y)
  }

  /**水平居中 */
  centerX(x: number = 0) {
    let ax = getAbsoluteValue(x, this.width)
    this.target.x = round((this.width - this.target.width) / 2) + ax + this.offsetX
    return this
  }

  /**垂直居中 */
  centerY(y: number = 0) {
    let ay = getAbsoluteValue(y, this.height)
    this.target.y = round((this.height - this.target.height) / 2) + ay + this.offsetY
    return this
  }
}

/**
 * 设置目标相对于指定区域的位置布局，默认区域是舞台大小
 * 可以设置负数或小数，小数表示相对于舞台大小的百分比
 * @param target 需要布局的显示对象
 * @param width 设置布局空间的宽，默认为setLayoutSize方法设置的宽
 * @param height 设置布局空间的高，默认为setLayoutSize方法设置的高
 */
export function layout(target: Container, width: number = stageWidth, height: number = stageHeight): LayoutObject {
  return new LayoutObject(target, width, height)
}
