import { OContainer, OText, ox } from 'oixi2'
import { Container, Text, InteractionEvent } from 'pixi.js';
import { AppRect } from './AppRect';
import { WIDTH, HEIGHT, COLOR_LIGHT } from '../game/constant';
import { layout } from '../utils/layout';
import { AppBox } from './AppBox';
import { WorldHeroItem, XWorldHeroItem } from './WorldHeroItem';
import Hero from '../model/Hero';
import { GoodsMagic } from '../model/GoodsMagic';
import { tempData } from '../game/dataTemp';
import { Ease, tween } from '../utils/tween'
import { getHeros } from '../game/database';
import { useGoodsInWorld } from '../game/handleGoodsWorld';
import { playSound } from '../utils/sound';

export function WorldInfoMagicTarget(attributes: string) {
  return ox(new XWorldInfoMagicTarget, attributes, () => [
    AppRect(WIDTH, HEIGHT, 0, 'alpha=0.4 @pointertap=onClose'),
    layout(
      OContainer('#box pivot.x=115 pivot.y=60', [
        AppBox(230, 120, 'interactive=1', COLOR_LIGHT, 0, 0, 2),
        OText('#title anchor=0.5 x=115 y=30', { fill: 0, fontSize: 16 }),
        OContainer('#heroBox y=56 @pointertap=onTap')
      ])
    ).center().target
  ])
}

export class XWorldInfoMagicTarget extends Container {
  private heroBox: Container = null
  private box: Container = null
  private title: Text = null

  private items: XWorldHeroItem[] = []
  private source: Hero
  private goods: GoodsMagic

  onClose() {
    this.visible = false
    tempData.isStopMove = false
  }

  onTap(e: InteractionEvent) {
    let m = e.target
    if (m instanceof XWorldHeroItem) {
      playSound('tap_2')

      let target = getHeros()[m.index]
      useGoodsInWorld(target, this.goods, this.source)
      this.emit('refresh')
      this.onClose()
    }
  }

  open(source: Hero, goods: GoodsMagic) {
    this.source = source
    this.goods = goods

    this.items.forEach(m => m.visible = false)
    getHeros().forEach((h, i) => {
      let m = this.items[i]
      if (!m) {
        m = WorldHeroItem(i)
        m.x = i * 50
        this.items.push(m)
        this.heroBox.addChild(m)
      }
      m.update(h)
      m.visible = true
    })

    layout(this.heroBox, 230, 120).centerX()
    this.title.text = `对谁施展【${goods.name_s}】？`

    tempData.isStopMove = true
    this.visible = true
    this.box.scale.set(0)
    tween(this.box.scale).to({ x: 1, y: 1 }, 300, Ease.backOut)
  }
}