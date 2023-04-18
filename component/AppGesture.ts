import { InteractionEvent, Point, Container, Rectangle } from 'pixi.js';
import { sqrt } from '../utils/math';
import { oxs } from 'oixi2';

type GestureOption = {
  /**触控范围宽度，如果为0则以child的交互范围为准 */
  hitWidth?: number,
  /**触控范围高度 */
  hitHeight?: number,
  /**是否可缩放，默认true */
  scale?: boolean,
  /**是否可拖放，默认true */
  drag?: boolean,
  /**缩放下限，默认0 */
  minScale?: number,
  /**缩放上限，默认2 */
  maxScale?: number
}

/**
 * 支持手势缩放和拖动的控件
 * 如果不作为容器，可以监听 \@scale 或 \@drag
 * 
 * \@scale 缩放触发，返回参数{center:Point, scale:number}
 * 
 * \@drag 拖放触发，返回参数{offsetX:number, offsetY:number}
 * 
 * \@end 手势结束触发
 * 
 * @param attributes 
 * @param child 控制其缩放和拖动的目标对象
 * @param options
 * @returns 
 */
export function AppGesture(attributes: string, options: GestureOption = {}, slots?: Container[]) {
  return oxs(new XAppGesture(options), attributes, slots)
}

class XAppGesture extends Container {
  private scaleable: boolean
  private dragable: boolean
  private minScale: number
  private maxScale: number

  private lastDragX: number = -1
  private lastDragY: number = -1

  private lastDistance: number = 0

  constructor(options: GestureOption) {
    super()
    this.dragable = options.drag === undefined ? true : options.drag
    this.scaleable = options.scale === undefined ? true : options.scale
    this.minScale = options.minScale || 0
    this.maxScale = options.maxScale || 2

    let hw = options.hitWidth || 0
    let hh = options.hitHeight || 0
    if (hw != 0 && hh != 0) {
      this.hitArea = new Rectangle(0, 0, hw, hh)
    }

    this.interactive = true

    this.on('touchstart', this.onStart, this)
    this.on('touchmove', this.onMove, this)
    this.on('touchend', this.onEnd, this)
    this.on('touchendoutside', this.onOutSide, this)
  }

  onStart(event: InteractionEvent) {
    let e = event.data.originalEvent as TouchEvent
    let n = e.touches.length

    if (this.dragable && n == 1) {
      this.lastDragX = e.touches[0].clientX
      this.lastDragY = e.touches[0].clientY

    } else if (this.scaleable && n == 2) {
      let dx = e.touches[1].clientX - e.touches[0].clientX
      let dy = e.touches[1].clientY - e.touches[0].clientY

      this.lastDistance = sqrt(dx * dx + dy * dy)
    }
  }

  onMove(event: InteractionEvent) {
    let e = event.data.originalEvent as TouchEvent
    let n = e.touches.length

    if (this.dragable && n == 1 && this.lastDragX > 0) {
      let offsetX = e.touches[0].clientX - this.lastDragX
      let offsetY = e.touches[0].clientY - this.lastDragY
      this.lastDragX = e.touches[0].clientX
      this.lastDragY = e.touches[0].clientY

      this.onDrag(offsetX, offsetY)
      this.emit('drag', offsetX, offsetY)

    } else if (this.scaleable && n == 2 && this.lastDistance > 0) {
      let dx1 = e.touches[0].clientX
      let dy1 = e.touches[0].clientY
      let dx2 = e.touches[1].clientX
      let dy2 = e.touches[1].clientY
      let dx = dx2 - dx1
      let dy = dy2 - dy1

      let newDistance = sqrt(dx * dx + dy * dy)
      let center = new Point((dx1 + dx2) / 2, (dy1 + dy2) / 2)
      let scale = newDistance / this.lastDistance
      this.lastDistance = newDistance

      this.onScale(center, scale)
      this.emit('scale', center, scale)
    }
  }

  onEnd(event: InteractionEvent) {
    let e = event.data.originalEvent as TouchEvent
    let n = e.touches.length

    if (this.dragable && n == 0) {
      this.lastDragX = -1
      this.lastDragY = -1

    } else if (this.scaleable && n == 1) {
      this.lastDistance = 0

      this.lastDragX = e.touches[0].clientX
      this.lastDragY = e.touches[0].clientY
    }

    if ((this.dragable || this.scaleable) && n == 0) {
      this.emit('end')
    }
  }

  onOutSide() {
    if (this.dragable) {
      this.lastDragX = -1
      this.lastDragY = -1
    }

    if (this.scaleable) {
      this.lastDistance = 0
    }

    if (this.dragable || this.scaleable) {
      this.emit('end')
    }
  }

  onScale(center: Point, scale: number) {
    this.children.forEach(child => {
      let s = child.scale
      let p1 = this.toLocal(center)

      let dx = child.x - child.pivot.x * s.x
      let dy = child.y - child.pivot.y * s.y
      let p2 = new Point((p1.x - dx) / s.x, (p1.y - dy) / s.y)

      child.position.copyFrom(p1)
      child.pivot.copyFrom(p2)

      let z = s.x * scale
      if (z < this.minScale) {
        s.set(this.minScale)
      } else if (z > this.maxScale) {
        s.set(this.maxScale)
      } else {
        s.set(z)
      }
    })
  }

  onDrag(x: number, y: number) {
    this.children.forEach(child => {
      child.x += x
      child.y += y
    })
  }
}