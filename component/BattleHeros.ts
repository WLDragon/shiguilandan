import { ox } from 'oixi2'
import { Container } from 'pixi.js'
import { getHeros } from '../game/database'
import { tempData } from '../game/dataTemp'
import { BattleHerosItem, XBattleHerosItem } from './BattleHerosItem'
import Hero from '../model/Hero';

const INDEX_POINTS = [{ x: 128, y: 32 }, { x: 80, y: 64 }, { x: 176, y: 0 }, { x: 32, y: 96 }]

export function BattleHeros(attributes: string) {
  return ox(new XBattleHeros, attributes)
}

export class XBattleHeros extends Container {
  heroItems: XBattleHerosItem[]
  lastHeroItem: XBattleHerosItem

  init() {
    this.removeChildren().forEach(c => c.destroy())

    this.heroItems = []
    tempData.battleHeros = getHeros()
    tempData.battleHeros.forEach((h, i) => {
      let bhi = BattleHerosItem(h)
      let o = INDEX_POINTS[i]
      bhi.fixPosition(o.x, o.y)
      this.addChild(bhi)
      this.heroItems.push(bhi)
    })
  }

  active(hero: Hero) {
    let h = this.heroItems.find(h => h.data == hero)
    if (this.lastHeroItem) {
      this.lastHeroItem.display.stop()
    }
    this.lastHeroItem = h
    h.display.play()
  }

  toSelectMode(value: boolean) {
    //过滤掉已经挂掉的对象
    this.heroItems = this.heroItems.filter(h => !h.destroyed)

    if (value) {
      let waitTime = (this.heroItems.length > 1 ? (this.heroItems.length - 1) : 1) * 600
      this.heroItems.forEach((h, i) => h.glint(i * 600, waitTime))

    } else {
      this.heroItems.forEach(h => h.stopGlint())
    }
  }

  getItemById(id: number) {
    return this.heroItems.find(h => h.data.id_16 == id)
  }

  stop() {
    this.heroItems.forEach(h => h.display.stop())
  }
}