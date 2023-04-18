///在地图中使用物品

import Hero from '../model/Hero';
import { Goods } from '../model/Goods';
import { GoodsMagic } from '../model/GoodsMagic';
import { GOODS_WORLD_USE1 } from './handleGoodsWorldType1';
import { GOODS_WORLD_USE3 } from './handleGoodsWorldType3';
import { GOODS_WORLD_USE4 } from './handleGoodsWorldType4';
import { GOODS_WORLD_USE5 } from './handleGoodsWorldType5';

/**在地图上使用丹药、符箓、法术和其他通关物品 */
export function useGoodsInWorld(target: Hero, goods: Goods, source: Hero = null) {
  let handles: { [x in number]: (hero: Hero, goods: Goods) => boolean }
  if (goods.type_8 == 1) {
    handles = GOODS_WORLD_USE1
  } else if (goods.type_8 == 3) {
    handles = GOODS_WORLD_USE3
  } else if (goods.type_8 == 4) {
    handles = GOODS_WORLD_USE4
  } else if (goods.type_8 == 5) {
    handles = GOODS_WORLD_USE5
  }

  let success = handles[goods.id_16](target, goods)
  if (success) {
    if (goods.type_8 == 4) {
      source.mp_16 -= (goods as GoodsMagic).mp_16
    }
  }
}
