import { GoodsEquip } from '../model/GoodsEquip';
import Hero from '../model/Hero';
import { increaseGoods, decreaseGoods } from './dataManager';
import { getGoodsById } from './app';
import { playSound } from '../utils/sound';

export function equipGoods(hero: Hero, goods: GoodsEquip) {
  let index = goods.type2_8 - 1
  let oequip = hero.equip_a[index]

  if (oequip) {
    let oGoods = getGoodsById(oequip)
    increaseGoods(oGoods, 1)
  }

  decreaseGoods(goods, 1)

  hero.equip_a[index] = goods.id_16
  if (goods.type2_8 == 1) {
    hero.attackEx_32 = goods.value_32

  } else if (goods.type2_8 == 2) {
    hero.defendEx_32 = goods.value_32

  } else {
    hero.agileEx_16 = goods.value_32
  }
}

export function unEquipGoods(hero: Hero, index: number) {
  playSound('tap_3')

  let eid = hero.equip_a[index]
  let oequip = getGoodsById(eid) as GoodsEquip
  increaseGoods(oequip, 1)

  hero.equip_a[index] = 0
  if (oequip.type2_8 == 1) {
    hero.attackEx_32 = 0

  } else if (oequip.type2_8 == 2) {
    hero.defendEx_32 = 0

  } else {
    hero.agileEx_16 = 0
  }
}