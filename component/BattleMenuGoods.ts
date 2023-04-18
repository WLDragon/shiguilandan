import { ox } from 'oixi2';
import { Container } from 'pixi.js'
import { AppBox } from './AppBox';
import { AppGoodsList, XAppGoodsList } from './AppGoodsList';
import { _GoodsQuantity } from '../model/notype/_GoodsQuantity';

export function BattleMenuGoods(attributes: string) {
  return ox(new XBattleMenuGoods, attributes, () => [
    AppBox(230, 230),
    AppGoodsList('#goodsList @select=onSelect x=9 y=9', 6, 6),
  ])
}

export class XBattleMenuGoods extends Container {
  goodsList: XAppGoodsList = null

  onSelect(goodsId: number) {
    if (goodsId) {
      this.emit('select', goodsId)
    }
  }

  toggle(gq: _GoodsQuantity[]) {

    if (this.visible) {
      this.hide()

    } else {
      this.goodsList.updateByQuantity(gq)
      this.visible = true
    }
  }

  hide() {
    this.visible = false
  }
}