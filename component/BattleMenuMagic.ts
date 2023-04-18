import { ox } from 'oixi2'
import { Container, InteractionEvent } from 'pixi.js'
import { AppContainer } from './AppContainer'
import { AppButton, XAppButton } from './AppButton';
import { AppBox } from './AppBox';
import Hero from '../model/Hero';
import { getGoodsById } from '../game/app';
import { GoodsMagic } from '../model/GoodsMagic';
import { COLOR_DEEP } from '../game/constant';
import { playSound } from '../utils/sound';

export function BattleMenuMagic(attributes: string) {
  return ox(new XBattleMenuMagic, attributes, () => [
    AppBox(138, 270),
    AppContainer('x=69 y=23 @pointertap=onTap', { height: 32 }, [
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 0),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 1),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 2),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 3),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 4),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 5),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 6),
      AppButton('#btns', 'btn4.png', '', 14, COLOR_DEEP, 7)
    ])
  ])
}

export class XBattleMenuMagic extends Container {
  private btns: XAppButton[] = []
  hero: Hero

  onTap(e: InteractionEvent) {
    let m = e.target
    if (m instanceof XAppButton) {
      playSound('tap_1')
      this.emit('select', this.hero.magics_a[m.id])
    }
  }

  toggle(hero: Hero) {
    if (this.visible) {
      this.hide()
    } else {
      this.hero = hero
      this.btns.forEach((b, i) => {
        let m = hero.magics_a[i]
        if (m) {
          let g = getGoodsById(m) as GoodsMagic
          b.label = g.name_s + ' ' + g.mp_16
          b.enable = hero.mp_16 >= g.mp_16

        } else {
          b.label = ''
          b.enable = false
        }
      })

      this.visible = true
    }
  }

  hide() {
    this.visible = false
  }
}