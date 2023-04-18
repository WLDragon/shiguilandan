import { ox } from 'oixi2'
import { Container, InteractionEvent } from 'pixi.js';
import { AppContainer } from './AppContainer'
import { AppButton, XAppButton } from './AppButton';
import Hero from '../model/Hero';
import { getGoodsById } from '../game/app';
import { COLOR_DEEP } from '../game/constant';
import { GoodsMagic } from '../model/GoodsMagic';
import { playSound } from '../utils/sound';

export function WorldInfoMagic(attributes: string) {
  return ox(new XWorldInfoMagic, attributes, () => [
    AppContainer('@pointertap=onTap', { height: 36 }, [
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

export class XWorldInfoMagic extends Container {
  btns: XAppButton[] = []
  hero: Hero

  onTap(e: InteractionEvent) {
    let m = e.target
    if (m instanceof XAppButton) {
      playSound('tap_1')
      this.emit('select', this.hero.magics_a[m.id])
    }
  }

  update(h: Hero) {
    this.hero = h
    this.btns.forEach((b, i) => {
      let m = h.magics_a[i]

      if (m) {
        let g = getGoodsById(m) as GoodsMagic
        b.label = g.name_s + ' ' + g.mp_16
        b.enable = true

      } else {
        b.label = ''
        b.enable = false
      }
    })
  }
}

