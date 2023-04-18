import { OSprite, ox } from 'oixi2'
import { Container, Sprite, Texture } from 'pixi.js';
import Hero from '../model/Hero';
import { unEquipGoods } from '../game/handleGoodsEquip';

export function WorldInfoEquip(attributes: string) {
  return ox(new XWorldInfoEquip, attributes, () => [
    OSprite(null, 'equipBg.png'),
    OSprite('#equips @pointertap=onTap1 x=10 y=8'),
    OSprite('#equips @pointertap=onTap2 x=48 y=8'),
    OSprite('#equips @pointertap=onTap3 x=86 y=8'),
  ])
}

export class XWorldInfoEquip extends Container {
  private equips: Sprite[] = []
  private hero: Hero

  onTap1() {
    unEquipGoods(this.hero, 0)
    this.emit('refresh')
  }

  onTap2() {
    unEquipGoods(this.hero, 1)
    this.emit('refresh')
  }

  onTap3() {
    unEquipGoods(this.hero, 2)
    this.emit('refresh')
  }


  update(hero: Hero) {
    this.hero = hero
    for (let i = 0; i < 3; i++) {
      let e = hero.equip_a[i]
      if (e) {
        this.equips[i].texture = Texture.from(`g${e}.png`)
        this.equips[i].visible = true

      } else {
        this.equips[i].visible = false
      }
    }
  }
}