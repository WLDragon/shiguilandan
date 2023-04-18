import { ox, OSprite } from 'oixi2';
import { Container, Sprite, Rectangle, InteractionEvent } from 'pixi.js';
import { WIDTH, UP, DOWN, LEFT, RIGHT } from '../game/constant';
import { WorldRockerTutor, XWorldRockerTutor } from './WorldRockerTutor';
import { settings, saveSettings } from '../game/dataSaved';
import { tipsText } from './AppTips';

export function WorldRocker(attributes: string) {
  return ox(new XWorldRocker, attributes, () => [
    OSprite('#rocker1 x=100 y=280 alpha=0 anchor=0.5', 'rocker1.png'),
    OSprite('#rocker2 x=100 y=280 alpha=0 anchor=0.5', 'rocker2.png'),
    WorldRockerTutor('#tutor visible=0')
  ])
}

export class XWorldRocker extends Container {
  rocker1: Sprite = null
  rocker2: Sprite = null
  tutor: XWorldRockerTutor = null

  originX: number = -1
  originY: number = -1

  lastDirect = -1
  lastKey: string
  lastTime: number = -1

  constructor() {
    super()
    this.interactive = true
    this.hitArea = new Rectangle(0, 0, WIDTH, 360)
    this.on('touchstart', this.onTouchStart, this)
    this.on('touchmove', this.onTouchMove, this)
    this.on('touchend', this.onTouchEnd, this)
    this.on('touchendoutside', this.onTouchEnd, this)
  }

  onKeyPress = (e: KeyboardEvent) => {
    let direct = -1
    if (e.key == 'w') {
      direct = UP
    } else if (e.key == 's') {
      direct = DOWN
    } else if (e.key == 'a') {
      direct = LEFT
    } else if (e.key == 'd') {
      direct = RIGHT
    }

    if (direct != this.lastDirect) {
      this.lastKey = e.key
      this.lastDirect = direct
      this.emit('direct', direct)
    }
  }

  onKeyUp = (e: KeyboardEvent) => {
    if (this.lastKey == e.key) {
      this.lastDirect = -1
      this.emit('end')
    }
  }

  onTouchStart(e: InteractionEvent) {
    let event = e.data.originalEvent as TouchEvent
    if (event.touches.length == 1) {
      let op = this.toLocal(e.data.global)
      this.originX = op.x
      this.originY = op.y
      this.rocker1.position.set(op.x, op.y)
      this.rocker2.position.set(op.x, op.y)
      this.rocker1.alpha = 0.4
      this.rocker2.alpha = 0.5
    }
  }

  onTouchMove(e: InteractionEvent) {
    let t = Date.now()
    if (t - this.lastTime > 150) {//变换方向的时间间隔必须大于150毫秒
      this.lastTime = t

      let event = e.data.originalEvent as TouchEvent
      if (event.touches.length == 1 && this.originX != -1) {
        let np = this.toLocal(e.data.global)

        let dx = np.x - this.originX
        let dy = np.y - this.originY

        //判断方向
        let direct = -1
        if (dx == 0) {
          if (dy != 0) {
            direct = dy < 0 ? UP : DOWN
          }

        } else {
          //根据tan值来判断方向
          let tan = dy / dx
          if (tan <= -1 || tan >= 1) {
            direct = dy < 0 ? UP : DOWN

          } else {
            direct = dx < 0 ? LEFT : RIGHT
          }

        }

        if (direct != this.lastDirect) {
          let nx = this.originX
          let ny = this.originY
          if (direct == UP) {
            ny -= 40
          } else if (direct == DOWN) {
            ny += 40
          } else if (direct == LEFT) {
            nx -= 40
          } else {
            nx += 40
          }
          this.rocker2.position.set(nx, ny)

          this.lastDirect = direct
          this.emit('direct', direct)
        }
      }
    }
  }

  onTouchEnd() {
    if (settings.rockerTutor < 2) {
      if (settings.rockerTutor == 0 && this.lastDirect == LEFT) {
        settings.rockerTutor++
        this.tutor.next()

      } else if (settings.rockerTutor == 1 && this.lastDirect == DOWN) {
        settings.rockerTutor++
        saveSettings()
        this.tutor.next()
      }
    }

    this.rocker1.alpha = 0
    this.rocker2.alpha = 0
    this.lastDirect = -1
    this.originX = -1

    this.emit('end')
  }

  listenKeyEvents() {
    document.addEventListener('keypress', this.onKeyPress)
    document.addEventListener('keyup', this.onKeyUp)
  }

  removeKeyEvents() {
    document.removeEventListener('keypress', this.onKeyPress)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  active(isActive: boolean) {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      this.visible = isActive
      if (isActive) {
        if (settings.rockerTutor < 2) {
          this.tutor.visible = true
          this.tutor.next()
        }
      }

    } else if (settings.showKeybordTips) {
      tipsText('使用 WASD 按钮移动方向')
      settings.showKeybordTips = false
    }

  }

}