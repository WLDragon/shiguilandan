import { ox } from 'oixi2'
import { Container } from 'pixi.js'
import { COLOR_LIGHT, COLOR_DEEP } from '../game/constant';
import { AppRect, XAppRect } from './AppRect';

export function AppBox(width: number, height: number, attributes?: string, bgColor = COLOR_DEEP, borderColor = COLOR_LIGHT, borderOffset = 2, borderSize = 1) {

  let template = [
    AppRect(0, 0, borderColor, '#border'),
    AppRect(0, 0, bgColor, '#inner')
  ]
  if (borderOffset > 0) {
    template.unshift(AppRect(0, 0, bgColor, '#bg'))
  }

  return ox(new XAppBox, attributes, () => template).build(width, height, borderOffset, borderSize)
}

export class XAppBox extends Container {
  borderOffset: number
  borderSize: number

  bg: XAppRect = null
  border: XAppRect = null
  inner: XAppRect = null

  build(width: number, height: number, borderOffset: number, borderSize: number) {
    this.borderOffset = borderOffset
    this.borderSize = borderSize
    this.resize(width, height)
    return this
  }

  resize(width: number, height: number) {
    if (this.bg) {
      this.bg.width = width
      this.bg.height = height
    }

    let bo = this.borderOffset
    let io = bo + this.borderSize
    let bo2 = bo * 2
    let io2 = io * 2

    this.border.position.set(bo, bo)
    if (width - bo2 > 0) { //保证宽高不能为负数，不然下次即使赋正值也会出现scale为负数的情况
      this.border.width = width - bo2
    }
    if (height - bo2 > 0) {
      this.border.height = height - bo2
    }

    this.inner.position.set(io, io)
    if (width - io2 > 0) {
      this.inner.width = width - io2
    }
    if (height - io2 > 0) {
      this.inner.height = height - io2
    }
  }
}