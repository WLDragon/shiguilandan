import { ox } from 'oixi2';
import { Container, Sprite, Rectangle } from 'pixi.js';
import { Dot } from '../model/notype/Dot';
import { Scene } from '../model/Scene';
import { XAppSkin } from './AppSkin';
import { i2x, i2y } from '../utils/others';
import { getOppositeDirect, getTileTexture } from '../game/app';
import { DotNpc } from '../model/notype/DotNpc';
import { WorldSceneDotsNpc, XWorldSceneDotsNpc } from './WorldSceneDotsNpc';

type DisplayDot = ImageDot | HeroDot | XWorldSceneDotsNpc

export function WorldSceneDots(attributes: string) {
  return ox(new XWorldSceneDots, attributes)
}

export class XWorldSceneDots extends Container {
  dots: DisplayDot[] = []
  column: number
  row: number

  initSize(row: number, column: number) {
    this.column = column
    this.row = row
  }

  init(scene: Scene) {
    this.clearDots()
    this.dots.length = 0
    this.position.set(0, 0)

    this.addVisibleDots(scene.nearDots_o)
    this.addVisibleDots(scene.touchDots_o)
  }

  addVisibleDots(dots: Dot[]) {
    dots.forEach(d => {
      if (d['tile']) {
        let dt = new ImageDot(d, d['tile'])
        this.dots.push(dt)
        this.addChild(dt)

      } else if (d['skin']) {
        let dt: DisplayDot
        if (d.type == 7) {
          dt = WorldSceneDotsNpc(d as DotNpc, d['skin'])
        } else {
          dt = new HeroDot(d, d['skin'])
        }
        this.dots.push(dt)
        this.addChild(dt)
      }
    })
  }

  /**
   * 修正位置
   * @param beginX 可视范围内地图开始显示图块的位置X
   * @param beginY 
   * @param offsetX 容器应该偏移修正的位置
   * @param offsetY 
   */
  fix(beginX: number, beginY: number, offsetX: number, offsetY: number) {
    this.x += offsetX * 32
    this.y += offsetY * 32

    this.dots.forEach(d => {
      let data = d.dot
      let h = beginY + this.row
      let w = beginX + this.column

      if (data.x >= beginX && data.x <= w && data.y >= beginY && data.y <= h) {
        if (!d.visible || data.r) {
          data.r = 0
          d.x = (data.x - beginX) * 32 - this.x
          d.y = (data.y - beginY) * 32 - this.y
          d.visible = true

          if (d instanceof HeroDot) {
            d.play()
          } else if (d instanceof XWorldSceneDotsNpc) {
            d.active()
          }
        }

      } else if (d.visible) {
        d.visible = false
        if (d instanceof HeroDot) {
          d.stop()
        } else if (d instanceof XWorldSceneDotsNpc) {
          d.deactive()
        }
      }
    })
  }

  faceRole(dot: Dot, direct: number) {
    this.dots.forEach(d => {
      if (d.dot == dot) {
        (d as XAppSkin).direct = getOppositeDirect(direct)
        if (d instanceof XWorldSceneDotsNpc) {
          d.isChating = true
        }
      }
    })
  }

  removeDot(dot: Dot) {
    let d = this.children.find((c: (ImageDot | HeroDot)) => c.dot == dot)
    this.removeChild(d)
  }

  clearDots() {
    this.dots.forEach(d => {
      if (d instanceof XWorldSceneDotsNpc) {
        d.deactive()
      }
      d.destroy()
    })
  }
}



/**纯图片 */
class ImageDot extends Sprite {
  dot: Dot
  constructor(dot: Dot, tile: number) {
    super()
    this.dot = dot
    this.visible = false

    let x = i2x(tile, 32) * 32
    let y = i2y(tile, 32) * 32
    let rect = new Rectangle(x, y, 32, 32)
    this.texture = getTileTexture(tile, rect, 'tiles.png')
  }
}

/**不会走动的人 */
class HeroDot extends XAppSkin {
  dot: Dot
  constructor(dot: Dot, skin: string) {
    super(skin, true)
    this.dot = dot
    this.visible = false
  }
}
