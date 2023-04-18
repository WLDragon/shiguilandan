import { ox } from 'oixi2';
import { Container, filters } from 'pixi.js';
import { COLOR_POISON, COLOR_WHITE, COLOR_RED, COLOR_GRAY_E, COLOR_GRAY_5 } from '../game/constant';
import { AppSkin, XAppSkin } from './AppSkin';
import Hero from '../model/Hero';

const GRAY = new filters.ColorMatrixFilter()
GRAY.desaturate()

export function AppHero(attributes: string, skin?: string, shadow = false) {
  return ox(new XAppHero, attributes, () => [
    AppSkin('#skin', skin, shadow)
  ])
}

export class XAppHero extends Container {
  skin: XAppSkin = null
  data: Hero

  update(hero: Hero) {
    this.data = hero
    if (this.skin.skin != hero.skin_s) {
      this.skin.skin = hero.skin_s
      this.skin.updateTexture()
    }

    if (hero.hp_32 == 0) {
      this.skin.stop()
      this.skin.display.angle = -90
      this.skin.display.filters = [GRAY]

    } else {
      this.skin.display.angle = 0
      this.skin.display.filters = null

      if (hero.status_a.includes(1)) {
        this.skin.display.tint = COLOR_POISON

      } else if ((hero.hp_32 / hero.maxHp_32) < 0.3) {
        this.skin.display.tint = 0xfd887f

      } else {
        this.skin.display.tint = COLOR_WHITE
      }
    }
  }

  play() {
    if (this.data && this.data.hp_32) {
      this.skin.play()
    }
  }

  stop() {
    this.skin.stop()
  }

}