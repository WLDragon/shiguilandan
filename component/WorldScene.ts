import { ox, OContainer } from 'oixi2';
import { Container, Sprite, Rectangle } from 'pixi.js';
import { HEIGHT, WIDTH, UP, DOWN, LEFT, TILE_STEPS, TILE_BRIDGE, TILE_COVER, TILE_SEA, TILE_LAND1, TILE_LAND2, TILE_TREES, TILE_WATER } from '../game/constant';
import { ceil } from '../utils/math';
import { i2x, i2y, xy2i } from '../utils/others';
import { getTileTexture } from '../game/app';
import { tween } from '../utils/tween';
import { WorldSceneDots, XWorldSceneDots } from './WorldSceneDots';
import { getScene, getCommon } from '../game/database';
import { testkDots } from '../game/dotsManager';
import { Scene } from '../model/Scene';
import { Dot } from '../model/notype/Dot';
import { to } from '../utils/router';
import { showMaskSlowly } from './AppMask';
import { tempData } from '../game/dataTemp';
import { testHeroStatus } from '../game/buffManager';
import { linkDotsBeforeEnterScene } from '../game/dotsManagerLink';
import { getGoodsQuantity } from '../game/dataManager';
import { DotNest } from '../model/notype/DotNest';
import { SceneData } from '../model/notype/SceneData';
import { playSound } from '../utils/sound';

export function WorldScene(attributes: string) {
  return ox(new XWorldScene, attributes, () => [
    OContainer('#tileBox'),
    WorldSceneDots('#sceneDots'),
  ]).build()
}

export class XWorldScene extends Container {
  private sceneDots: XWorldSceneDots = null
  private tileBox: Container = null

  private mapData: Uint32Array
  private terrainData: Uint32Array
  private initX: number
  private initY: number
  private column: number
  private row: number

  private mapWidth: number
  private mapHeight: number

  private defaultTile: number

  private tiles: MapTile[] = []

  private currentX: number
  private currentY: number
  private nextX: number
  private nextY: number
  private moving = false
  private direct = -1
  private lastTile: number

  private scene: Scene

  build() {
    //地图实现算法查看：design/地图显示算法.png
    this.row = ceil((HEIGHT - 32) / 2 / 32) * 2 + 3
    this.column = ceil((WIDTH - 32) / 2 / 32) * 2 + 3
    this.initX = (WIDTH - this.column * 32) / 2
    this.initY = (HEIGHT - this.row * 32) / 2

    this.sceneDots.initSize(this.row, this.column)

    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        let mt = new MapTile(j * 32, i * 32)
        this.tileBox.addChild(mt)
        this.tiles.push(mt)
      }
    }
    return this
  }

  faceRole(dot: Dot, direct: number) {
    this.sceneDots.faceRole(dot, direct)
  }

  initScene(sceneData: SceneData, x: number, y: number) {
    this.currentX = x
    this.currentY = y

    this.mapData = sceneData.map
    this.terrainData = sceneData.terrain
    this.mapWidth = sceneData.width
    this.mapHeight = sceneData.height
    this.defaultTile = sceneData.tile

    let i = xy2i(x, y, this.mapWidth)
    let t = this.terrainData[i]
    let c = getCommon()

    if (t) {
      this.lastTile = t
    } else {
      throw Error(`position ${x},${y} no terrain!`)
    }

    c.sceneX_16 = x
    c.sceneY_16 = y
    c.scene_s = sceneData.name
    this.scene = getScene(sceneData.name)
    linkDotsBeforeEnterScene(this.scene)

    this.sceneDots.init(this.scene)
  }

  removeSceneDot(dot: Dot) {
    this.sceneDots.removeDot(dot)
  }

  locate(x: number, y: number) {
    let offsetX = this.currentX - x
    let offsetY = this.currentY - y

    this.currentX = x
    this.currentY = y
    this.position.set(this.initX, this.initY)

    let dw = (this.column - 1) / 2
    let dh = (this.row - 1) / 2
    let beginX = x - dw
    let beginY = y - dh

    this.sceneDots.fix(beginX, beginY, offsetX, offsetY)

    //更新地图图块
    const MAP_COLUMN = this.mapWidth
    const MAP_ROW = this.mapHeight
    let n = 0
    let rect = new Rectangle(0, 0, 32, 32)
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        let tx = beginX + j
        let ty = beginY + i
        if (tx >= 0 && tx < MAP_COLUMN && ty >= 0 && ty < MAP_ROW) {
          let t0 = xy2i(tx, ty, MAP_COLUMN)
          let t1 = this.mapData[t0] - 1
          let t2 = t1 == -1 ? this.defaultTile : t1
          this.tiles[n++].update(t2, rect)
        } else {
          this.tiles[n++].update(this.defaultTile, rect)
        }
      }
    }
  }

  move(direct: number) {
    if (direct != this.direct) {
      this.direct = direct
      getCommon().direct_8 = direct

      playSound('walk')

      if (!this.moving) {
        this.moveStep(direct)
      }
    }
  }

  private moveStep(direct: number) {
    let tx = this.currentX
    let ty = this.currentY
    let dx = this.x
    let dy = this.y

    if (direct == UP) {
      ty -= 1
      dy += 32
    } else if (direct == DOWN) {
      ty += 1
      dy -= 32
    } else if (direct == LEFT) {
      tx -= 1
      dx += 32
    } else {
      tx += 1
      dx -= 32
    }

    let i = xy2i(tx, ty, this.mapWidth)
    //检查下一个方块是否为通路
    if (this.testAccess(this.terrainData[i])) {
      //进入下一个方块前检查，没有触发点再前进
      if (testkDots(tx, ty, this.scene.nearDots_o)) {
        if (tx >= 0 && tx < this.mapWidth && ty >= 0 && ty < this.mapHeight) {
          this.moving = true
          this.nextX = tx
          this.nextY = ty

          this.changeSkinStatus(this.terrainData[i])

          getCommon().sceneX_16 = tx
          getCommon().sceneY_16 = ty
          tween(this.position)
            .to({ x: dx, y: dy }, 150)
            .onComplete(this.onStepComplete)
        }
      }
    }

  }

  private testAccess(nextTile: number) {
    if (!nextTile) return false

    let c = getCommon()
    if (this.lastTile == nextTile) {
      return true

    } else if (TILE_COVER == this.lastTile) {
      return true

    } else if (TILE_STEPS == this.lastTile) {
      if (TILE_SEA == nextTile) {
        if (getGoodsQuantity(5008) > 0) { //有小舟才能下海
          return true
        }

      } else {
        return true
      }

    } else if (TILE_LAND1 == this.lastTile && TILE_TREES == nextTile) {
      return true

    } else if (TILE_TREES == this.lastTile && TILE_LAND1 == nextTile) {
      return true

    } else if (TILE_STEPS == nextTile || TILE_BRIDGE == nextTile || TILE_COVER == nextTile) {
      return true

    }

    return false
  }

  private changeSkinStatus(nextTile: number) {
    let c = getCommon()
    let status = c.skinStatus_8
    let cover = 0

    if (TILE_LAND1 == nextTile || TILE_LAND2 == nextTile) {
      status = 1

    } else if (TILE_TREES == nextTile) {
      status = 2

    } else if (TILE_WATER == nextTile) {
      status = 2

    } else if (TILE_SEA == nextTile) {
      status = 3

    } else if (TILE_STEPS == nextTile) {
      status = 1

    } else if (TILE_BRIDGE == nextTile) {
      if (c.skinStatus_8 == 2) {
        cover = 1
      }

    } else if (TILE_COVER) {
      cover = 1
    }

    if (TILE_BRIDGE != nextTile && TILE_COVER != nextTile) {
      this.lastTile = nextTile
    }

    if (c.skinStatus_8 != status || c.isCover_8 != cover) {
      c.skinStatus_8 = status
      c.isCover_8 = cover
      this.emit('change')
    }
  }

  private onStepComplete = () => {
    this.moving = false
    this.locate(this.nextX, this.nextY)

    if (testHeroStatus()) {
      //确定位置后检查，没有触发点再前进
      if (testkDots(this.currentX, this.currentY, this.scene.touchDots_o)) {
        let dot = this.testMetOgre()
        if (dot) {
          tempData.isStopMove = true
          showMaskSlowly(() => {
            to('Battle', dot)
          })

        } else if (this.direct != -1) {
          this.moveStep(this.direct)
        }

      } else {
        this.direct = -1
      }
    }

  }

  /**指定移动步数就会遇到妖兽 */
  private testMetOgre(): DotNest {
    if (!tempData.isStealth) {
      let c = getCommon()
      c.ogreCount_8++
      if (c.ogreCount_8 > 11) {
        c.ogreCount_8 = 0
      }

      let nest = this.scene.nestDots_o
      if (nest.length && c.ogreCount_8 == 0) {
        for (let i = 0; i < nest.length; i++) {
          let o = nest[i]
          let w = o.x + o.w
          let h = o.y + o.h
          let x = this.currentX
          let y = this.currentY
          if (x >= o.x && y >= o.y && x < w && y < h) {
            return o
          }
        }
      }
    }

    return null
  }

  stop() {
    this.direct = -1
  }

  release() {
    this.sceneDots.clearDots()
  }

  /**施展缩地术闪现 */
  flashMagic(param: { t: number, tx: number, ty: number }) {
    this.lastTile = param.t
    this.locate(param.tx, param.ty)
    this.changeSkinStatus(param.t)
  }
}



/**地图纹理块 */
class MapTile extends Sprite {
  type = -1

  constructor(x: number, y: number) {
    super()
    this.visible = false
    this.position.set(x, y)
  }

  update(type: number, rect?: Rectangle) {
    if (this.type != type) {
      this.type = type
      if (type == -1) {
        this.visible = false

      } else {
        rect.x = i2x(type, 32) * 32
        rect.y = i2y(type, 32) * 32
        this.texture = getTileTexture(type, rect, 'tiles.png')
        this.visible = true
      }
    }
  }
}