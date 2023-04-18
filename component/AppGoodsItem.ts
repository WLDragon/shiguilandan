import { ox, OSprite } from 'oixi2';
import { Container, Sprite, Texture } from 'pixi.js'
import { AppNumber, XAppNumber } from './AppNumber';

export function AppGoodsItem(attributes: string) {
  return ox(new XAppGoodsItem, attributes, () => [
    OSprite('#bg', 'goodsBg1.png'),
    OSprite('#img'),
    AppNumber('#num x=4 y=24', 'm', 4)
  ])
}

export class XAppGoodsItem extends Container {
  bg: Sprite = null
  img: Sprite = null
  num: XAppNumber = null

  goodsId: number

  constructor() {
    super()
    this.interactive = true
  }

  update(goodsId: number, quantity: number, showNumber: boolean) {
    if (goodsId) {
      this.goodsId = goodsId
      this.img.texture = Texture.from('g' + goodsId + '.png')
      this.img.visible = true
      if (showNumber) {
        this.num.setValue(quantity)
        this.num.visible = true
      }

    } else {
      this.goodsId = 0
      this.img.visible = false
      this.num.visible = false
    }
  }

  select(value: boolean) {
    this.bg.texture = Texture.from(value ? 'goodsBg2.png' : 'goodsBg1.png')
  }
}