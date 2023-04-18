import { ox } from 'oixi2'
import { Container } from 'pixi.js'
import { getOgreById } from '../game/app';
import { getHero } from '../game/database';
import { tempData } from '../game/dataTemp';
import { floor, random } from '../utils/math';
import { copyObject, remove } from '../utils/others';
import { BattleOgresItem, XBattleOgresItem } from './BattleOgresItem';
import Ogre from '../model/Ogre';
import { getGoodsQuantity } from '../game/dataManager';

const INDEX_POINTS = [{ x: 342, y: 32 }, { x: 390, y: 64 }, { x: 294, y: 0 }, { x: 438, y: 96 }, { x: 432, y: 32 }, { x: 384, y: 0 }, { x: 480, y: 64 }]

export function BattleOgres(attributes: string) {
  return ox(new XBattleOgres, attributes)
}

export class XBattleOgres extends Container {
  orgeItems: XBattleOgresItem[]

  copyOgreData(ore: Ogre) {
    let o = copyObject(ore)
    o.maxHp_32 = o.hp_32
    o.maxMp_16 = o.mp_16
    return o
  }

  handleBossStatus(o: Ogre) {
    if (o.status_a.includes(101)) {
      if (getGoodsQuantity(5005) > 0) {
        remove(101, o.status_a)
      }
    }
  }

  init(param: { ogres: number[], boss: boolean }) {
    this.removeChildren().forEach(c => c.destroy())

    tempData.battleOgres = []
    this.orgeItems = []

    let ogreIds: number[] = []
    if (param.boss) {
      ogreIds = param.ogres

    } else {
      //随机从ids里提取不定数量妖兽
      //炼气之前最多2只，炼气5级之前最多4只，筑基之前最多5只，筑基之后最多7只
      let role = getHero(1)
      let max = 7
      if (role.grade_8 < 1) {
        max = 2
      } else if (role.grade_8 == 1 && role.level_8 <= 5) {
        max = 4
      } else if (role.grade_8 < 2) {
        max = 5
      }
      let n = floor(random() * max) + 1
      let m = param.ogres.length
      for (let i = 0; i < n; i++) {
        let id = param.ogres[floor(random() * m)]
        ogreIds.push(id)
      }
    }

    for (let i = ogreIds.length - 1; i >= 0; i--) {
      let id = ogreIds[i]
      let oo = getOgreById(id)
      let o = this.copyOgreData(oo)
      o.id_16 = 101 + i
      tempData.battleOgres.push(o)

      let boi = BattleOgresItem(o)
      let p = INDEX_POINTS[i]
      boi.position.set(p.x, p.y)
      this.addChild(boi)
      this.orgeItems.push(boi)

      if (param.boss) {
        this.handleBossStatus(o)
      }
    }
  }

  toSelectMode(value: boolean) {
    //过滤掉已经挂掉的对象
    this.orgeItems = this.orgeItems.filter(o => !o.destroyed)

    if (value) {
      let waitTime = (this.orgeItems.length > 1 ? (this.orgeItems.length - 1) : 1) * 600
      this.orgeItems.forEach((o, i) => o.glint(i * 600, waitTime))

    } else {
      this.orgeItems.forEach(o => o.stopGlint())
    }
  }

  getItemById(id: number) {
    return this.orgeItems.find(o => o.data.id_16 == id)
  }

}