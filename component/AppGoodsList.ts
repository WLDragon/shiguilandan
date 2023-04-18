import { ox } from 'oixi2'
import { Container, InteractionEvent } from 'pixi.js';
import { AppContainer } from './AppContainer';
import { XAppGoodsItem, AppGoodsItem } from './AppGoodsItem';
import { Goods } from '../model/Goods';
import { _GoodsQuantity } from '../model/notype/_GoodsQuantity';
import { playSound } from '../utils/sound';

export function AppGoodsList(attributes: string, row: number, column: number) {
  let gs: XAppGoodsItem[] = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      gs.push(AppGoodsItem('#items'))
    }
  }

  return ox(new XAppGoodsList, attributes, () => [
    AppContainer('@pointertap=onTap', { width: 36, height: 36, column }, gs)
  ])
}

export class XAppGoodsList extends Container {
  items: XAppGoodsItem[] = []

  updateByGoods(goods: Goods[]) {
    this.items.forEach((g, i) => {
      let o = goods[i]
      g.update(o ? o.id_16 : 0, 0, false)
    })
  }

  updateByQuantity(gq: _GoodsQuantity[]) {
    this.items.forEach((g, i) => {
      let m = gq[i]
      if (m) {
        g.update(m.i, m.n, true)
      } else {
        g.update(0, 0, false)
      }
    })
  }

  onTap(e: InteractionEvent) {
    let m = e.target
    if (m instanceof XAppGoodsItem) {
      playSound('tap_2')
      this.items.forEach(g => g.select(g == m))
      this.emit('select', m.goodsId)
    }
  }

  clearSelect() {
    this.items.forEach(g => g.select(false))
  }
}