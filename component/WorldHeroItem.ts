import { ox, OSprite } from 'oixi2';
import { Container, InteractionEvent } from 'pixi.js';
import { AppStrip, XAppStrip } from './AppStrip';
import { COLOR_GREEN, COLOR_BLUE } from '../game/constant';
import { AppHero, XAppHero } from './AppHero';
import Hero from '../model/Hero';
import { showAd } from '../native/h2n';
import { AppButton, XAppButton } from './AppButton';

export function WorldHeroItem(index: number) {
  return ox(new XWorldHeroItem(index), null, () => [
    OSprite(null, 'heroBg.png'),
    AppStrip('#barHp x=4 y=3', 32, 5, COLOR_GREEN),
    AppStrip('#barMp x=4 y=9', 32, 5, COLOR_BLUE),
    AppHero('#display skin.direct=4 x=4 y=14', 'h001'),
    AppButton('#btnRe x=20 y=65 @pointertap=onReborn', 'btn9.png')
  ])
}

export class XWorldHeroItem extends Container {
  barHp: XAppStrip = null
  barMp: XAppStrip = null
  display: XAppHero = null
  btnRe: XAppButton = null

  index: number
  hero: Hero

  constructor(i: number) {
    super()
    this.index = i
    this.interactive = true
  }

  onReborn(e: InteractionEvent) {
    e.stopPropagation()
    showAd('reborn_' + this.hero.id_16)
  }

  update(hero: Hero) {
    this.hero = hero
    this.display.update(hero)

    this.btnRe.visible = hero.hp_32 == 0
    this.barHp.setValue(hero.hp_32 / hero.maxHp_32)

    if (hero.maxMp_16 > 0) {
      this.barMp.setValue(hero.mp_16 / hero.maxMp_16)
    } else {
      this.barMp.setValue(0)
    }
  }
}