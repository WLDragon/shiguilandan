import { OSprite, ox } from 'oixi2'
import { Container, InteractionEvent, Point, Rectangle, Sprite } from 'pixi.js'
import { LEFT, UP, RIGHT, DOWN } from '../game/constant';

export function WorldKeyboard(attributes: string) {
  return ox(new XWorldKeyboard, attributes, () => [
    OSprite('alpha=0.5', 'keyboard.png'),
  ])
}

export class XWorldKeyboard extends Container {
  isActive = false

  constructor() {
    super()

    this.interactive = true
    this.hitArea = new Rectangle(0, 0, 128, 128)

    this.on('touchstart', this.onTouchStart, this)
    this.on('touchmove', this.onTouchMove, this)
    this.on('touchend', this.onTouchEnd, this)
    this.on('touchendoutside', this.onTouchEnd, this)

    return this
  }

  emitDirect(direct: number) {
    if (!this.isActive) {
      this.isActive = true
      this.emit('direct', direct)
    }
  }

  testArea(p: Point) {
    let x = p.x
    let y = p.y

    if (x > 0 && y > 48 && x < 48 && y < (48 + 32)) {
      this.emitDirect(LEFT)

    } else if (x > 48 && y > 0 && x < (48 + 32) && y < 48) {
      this.emitDirect(UP)

    } else if (x > 80 && y > 48 && x < (80 + 48) && y < (48 + 32)) {
      this.emitDirect(RIGHT)

    } else if (x > 48 && y > 80 && x < (48 + 32) && y < (80 + 48)) {
      this.emitDirect(DOWN)

    } else {
      this.isActive = false
    }
  }

  onTouchStart(e: InteractionEvent) {
    this.testArea(this.toLocal(e.data.global))
  }

  onTouchMove(e: InteractionEvent) {
    this.testArea(this.toLocal(e.data.global))
  }

  onTouchEnd() {
    this.isActive = false
    this.emit('end')
  }

}
