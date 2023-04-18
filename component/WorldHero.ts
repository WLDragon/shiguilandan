import { OSprite, ox } from 'oixi2'
import { Container, Sprite } from 'pixi.js';
import { AppSkin, XAppSkin } from './AppSkin';
import { tempData } from '../game/dataTemp';
import { UP, DOWN, LEFT } from '../game/constant';

export function WorldHero(attributes: string) {
  return ox(new XWorldHero, attributes, () => [
    AppSkin('#hero', 'h001', true),
    OSprite('#ico anchor=0.5 alpha=0.5 scale=0.5', 'ico_tri.png')
  ])
}

export class XWorldHero extends Container {
  hero: XAppSkin = null
  ico: Sprite = null
  timeOutId: any = 0

  setDirect(d: number) {
    this.hero.direct = d

    if (d == UP) {
      this.ico.position.set(16, -8)
      this.ico.angle = 180

    } else if (d == DOWN) {
      this.ico.position.set(16, 40)
      this.ico.angle = 0

    } else if (d == LEFT) {
      this.ico.position.set(-8, 16)
      this.ico.angle = 90

    } else {
      this.ico.position.set(40, 16)
      this.ico.angle = -90
    }
  }

  setSkin(skin: string) {
    if (this.hero.skin != skin) {
      this.hero.skin = skin
    }
    this.hero.shadow.visible = !(skin == 'h002' || skin == 'h003')
  }

  setActive(able: boolean) {
    if (able) {
      this.hero.play()
    } else {
      this.hero.stop()
    }
  }

  /**隐身10秒，不存档，重新读档恢复正常 */
  stealth() {
    this.alpha = 0.5
    tempData.isStealth = true

    clearTimeout(this.timeOutId)
    this.timeOutId = setTimeout(() => {
      this.appear()
    }, 10000)
  }

  appear() {
    this.alpha = 1
    tempData.isStealth = false
  }

}