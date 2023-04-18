import { ox, OSprite, OContainer } from 'oixi2';
import { Container, Sprite, InteractionEvent } from 'pixi.js';
import { AppRect } from './AppRect';
import { COLOR_DEEP, HEIGHT, COLOR_LIGHT, EVENT_UPDATE_LEFT_TOP, RIGHT } from '../game/constant';
import { AppHero, XAppHero } from './AppHero';
import { Ease, tween } from '../utils/tween';
import { AppBag, XAppBag } from './AppBag';
import { getHeros } from '../game/database';
import Hero from '../model/Hero';
import { getGoodsById } from '../game/app';
import { AppDesc, XAppDesc } from './AppDesc';
import { Goods } from '../model/Goods';
import { WorldInfoProperty, XWorldInfoProperty } from './WorldInfoProperty';
import { WorldInfoMagic, XWorldInfoMagic } from './WorldInfoMagic';
import { equipGoods } from '../game/handleGoodsEquip';
import { GoodsEquip } from '../model/GoodsEquip';
import { WorldInfoEquip, XWorldInfoEquip } from './WorldInfoEquip';
import { confirmText } from './AppConfirm';
import { decreaseGoods } from '../game/dataManager';
import { tipsText, warnText } from './AppTips';
import { useGoodsInWorld } from '../game/handleGoodsWorld';
import { emit } from '../utils/emitter';
import { fogetMagic, studyMagic } from '../game/handleGoodsStudy';
import { GoodsMagic } from '../model/GoodsMagic';
import { WorldInfoMagicTarget, XWorldInfoMagicTarget } from './WorldInfoMagicTarget';
import { playSound } from '../utils/sound';

export function WorldInfo(attributes: string) {
  return ox(new XWorldInfo, attributes, () => [
    //背包
    AppBag('#bag @select=onGoodsSelect y=35'),

    //浅底
    AppRect(302, HEIGHT, COLOR_LIGHT, 'x=48 interactive=1'),
    AppRect(2, HEIGHT, COLOR_DEEP, 'x=348'),

    //左边选择英雄
    AppRect(48, HEIGHT, COLOR_DEEP, 'interactive=1'),
    OSprite('#heroTabBg', 'heroTab.png'),
    OContainer('#heroBox @pointertap=onHeroTap'),
    OSprite('x=8 y=320 @pointertap=onCloseWithSound', 'close2.png'),

    WorldInfoProperty('#prop x=52 y=4'),
    WorldInfoEquip('#equip @refresh=onRefresh x=216 y=4'),
    WorldInfoMagic('#mgic @select=onMagicSelect x=280 y=74'),
    WorldInfoMagicTarget('#mgicTarget @refresh=onRefresh visible=0'),

    //物品描述
    AppDesc('#desc x=346 y=110 visible=0 @ok=onDescTap @kill=onKillGoods')
  ])
}

export class XWorldInfo extends Container {
  bag: XAppBag = null
  prop: XWorldInfoProperty = null
  mgic: XWorldInfoMagic = null
  mgicTarget: XWorldInfoMagicTarget = null
  equip: XWorldInfoEquip = null
  heroTabBg: Sprite = null
  heroBox: Container = null
  desc: XAppDesc = null

  heros: Hero[]
  activeHero: Hero

  onGoodsSelect(goodsId: number) {
    if (goodsId) {
      this.desc.show(getGoodsById(goodsId), 1)
    } else {
      this.desc.visible = false
    }
  }

  onMagicSelect(goodsId: number) {
    this.desc.show(getGoodsById(goodsId), 2)
    this.desc.visible = true
  }

  /**@param type 1-丢失 2-遗忘 */
  onKillGoods(type: number, goods: Goods) {
    if (type == 1) {
      confirmText(`确定丢弃所有的【${goods.name_s}】吗？`, () => {
        decreaseGoods(goods, 99999)
        this.bag.clearSelect()
        this.bag.update()
        tipsText(`已丢弃所有的【${goods.name_s}】`)
      })

    } else if (type == 2) {
      confirmText(`确定遗忘【${goods.name_s}】吗？`, () => {
        fogetMagic(this.activeHero, goods.id_16)
        this.mgic.update(this.activeHero)
      })
    }
  }

  /**@param type 1-使用 2-装备 3-领悟 */
  onDescTap(type: number, goods: Goods) {
    if (type == 1) {
      if (goods.type_8 == 4) {
        let g = goods as GoodsMagic
        if (this.activeHero.mp_16 >= g.mp_16) {
          if (g.for_8 == 1) {
            this.mgicTarget.open(this.activeHero, g)

          } else if (g.for_8 == 3) {
            useGoodsInWorld(null, g, this.activeHero)
          }

        } else {
          warnText(`法力不足！需要${g.mp_16}法力`)
        }

      } else {
        useGoodsInWorld(this.activeHero, goods)
        this.onRefresh()
      }

    } else if (type == 2) {
      equipGoods(this.activeHero, goods as GoodsEquip)
      this.onRefresh()

    } else if (type == 3) {
      studyMagic(this.activeHero, goods as GoodsMagic)
      this.mgic.update(this.activeHero)
      this.bag.clearSelect()

    } else if (type == 4) {

    }
  }

  onRefresh() {
    this.equip.update(this.activeHero)
    this.prop.update(this.activeHero)
    this.bag.clearSelect()
    this.bag.update()
    this.heroBox.children.forEach((h: XAppHero) => {
      if (h.visible) {
        h.update(h.data)
      }
    })
    emit(EVENT_UPDATE_LEFT_TOP)
  }

  onHeroTap(e: InteractionEvent) {
    let i = this.heroBox.children.indexOf(e.target)
    if (i > -1) {
      playSound('tap_2')
      this.heroTabBg.y = i * 48
      this.selectHero(i)
    }
  }

  selectHero(index: number) {
    this.activeHero = this.heros[index]
    this.prop.update(this.activeHero)
    this.mgic.update(this.activeHero)
    this.equip.update(this.activeHero)
  }

  open(index: number) {
    if (!this.visible) {
      this.heroTabBg.y = index * 48

      this.heroBox.children.forEach(c => c.visible = false)
      this.heros = getHeros()
      this.heros.forEach((h, i) => {
        let c = this.heroBox.children[i] as XAppHero
        if (!c) {
          c = AppHero('x=8 y=' + (8 + 48 * i))
          c.interactive = true
          c.skin.direct = RIGHT
          this.heroBox.addChild(c)
        }
        c.visible = true
        c.update(h)
      })

      this.selectHero(index)
      this.bag.update()

      this.visible = true
      tween(this.position).to({ x: 0 }, 300, Ease.sineOut)
      tween(this.bag.position).to({ x: 352 }, 300, Ease.sineOut)
    }
  }

  onCloseWithSound() {
    playSound('tap_3')
    this.onClose()
  }

  onClose() {
    if (this.visible) {
      this.desc.visible = false
      tween(this.bag.position).to({ x: 0 }, 200)
      tween(this.position).to({ x: -350 }, 200).onComplete(() => {
        this.visible = false
      })
    }
  }

}
