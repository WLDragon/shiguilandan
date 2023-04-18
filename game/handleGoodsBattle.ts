///在战斗中使用物品

import Hero from '../model/Hero';
import Ogre from '../model/Ogre';
import { Goods } from '../model/Goods';
import { GoodsMagic } from '../model/GoodsMagic';
import { GOODS_BATTLE_USE1 } from './handleGoodsBattleType1';
import { GOODS_BATTLE_USE3 } from './handleGoodsBattleType3';
import { GOODS_BATTLE_USE4 } from './handleGoodsBattleType4';

type Data = Hero | Ogre

/**使用丹药、符箓和法术 */
export function useGoodsInBattle(goods: Goods, source: Data, target: Data, allies: Data[], enemies: Data[]) {
  let handles: { [x in number]: (target: Data, allies: Data[], enemies: Data[]) => void }
  if (goods.type_8 == 1) {
    handles = GOODS_BATTLE_USE1
  } else if (goods.type_8 == 3) {
    handles = GOODS_BATTLE_USE3
  } else if (goods.type_8 == 4) {
    handles = GOODS_BATTLE_USE4
  }

  //如果是施展法术，释放者需要消耗法力
  if (goods.type_8 == 4) {
    source.mp_16 -= (goods as GoodsMagic).mp_16
  }
  handles[goods.id_16](target, allies, enemies)
}