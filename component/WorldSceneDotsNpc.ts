import { ox } from 'oixi2'
import { XAppSkin } from './AppSkin';
import { DotNpc } from '../model/notype/DotNpc';
import { floor, random } from '../utils/math';
import { ITween, tween } from '../utils/tween'
import { DOWN, LEFT, RIGHT, UP } from '../game/constant';
import { getCommon } from '../game/database';

export function WorldSceneDotsNpc(dot: DotNpc, skin: string) {
  return ox(new XWorldSceneDotsNpc(dot, skin))
}

export class XWorldSceneDotsNpc extends XAppSkin {
  public dot: DotNpc
  public isChating = false

  private speed: number
  private timeOutId: any = 0
  private frameId: number = 0
  private moveTween: ITween

  constructor(dot: DotNpc, skin: string) {
    super(skin, true)
    this.dot = dot
    this.visible = false
    this.speed = 2000 + floor(1000 * random())
  }

  active() {
    this.play()
    if (this.timeOutId) {
      clearTimeout(this.timeOutId)
    }
    this.action()
  }

  action = () => {
    if (this.isChating) {
      this.timeOutId = setTimeout(this.testRoleLeave, this.speed)
      return
    }

    let data = this.dot
    let x = data.x
    let y = data.y
    let tx = this.x
    let ty = this.y

    switch (this.direct) {
      case UP:
        y -= 1
        ty -= 32
        break;
      case DOWN:
        y += 1
        ty += 32
        break;
      case LEFT:
        x -= 1
        tx -= 32
        break;
      case RIGHT:
        x += 1
        tx += 32
        break;
    }

    let c = getCommon()
    let t1 = x >= data.ox && x < data.ox + data.w && y >= data.oy && y < data.oy + data.h
    let t2 = !(x == c.sceneX_16 && y == c.sceneY_16) //不与主角重叠
    if (t1 && t2) {
      data.x = x
      data.y = y
      this.moveTween = tween(this.position).to({ x: tx, y: ty }, 600).onComplete(() => {
        this.timeOutId = setTimeout(this.action, this.speed)
      })

    } else {
      //换方向
      if (this.direct == UP) {
        this.direct = RIGHT
      } else if (this.direct == DOWN) {
        this.direct = LEFT
      } else if (this.direct == LEFT) {
        this.direct = UP
      } else {
        this.direct = DOWN
      }

      this.frameId = requestAnimationFrame(this.action)
    }
  }

  private testRoleLeave = () => {
    let c = getCommon()
    let dx = this.dot.x - c.sceneX_16
    let dy = this.dot.y - c.sceneY_16

    let isHeroChat = false

    if (c.direct_8 == UP && dx == 0 && dy == -1) {
      isHeroChat = true
    } else if (c.direct_8 == DOWN && dx == 0 && dy == 1) {
      isHeroChat = true
    } else if (c.direct_8 == LEFT && dy == 0 && dx == -1) {
      isHeroChat = true
    } else if (c.direct_8 == RIGHT && dy == 0 && dx == 1) {
      isHeroChat = true
    }

    //主角在附近且方向对着NPC时，NPC不会走动
    if (isHeroChat) {
      this.timeOutId = setTimeout(this.testRoleLeave, this.speed)

    } else {
      this.isChating = false
      this.action()
    }
  }

  deactive() {
    if (this.moveTween) {
      this.moveTween.clear()
      this.moveTween = null
    }
    cancelAnimationFrame(this.frameId)
    clearTimeout(this.timeOutId)
    this.timeOutId = 0
    this.frameId = 0
    this.stop()
  }
}