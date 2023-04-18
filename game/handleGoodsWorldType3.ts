import { warnText } from '../component/AppTips';
import { Goods } from '../model/Goods';
import Hero from '../model/Hero';
import { emit } from '../utils/emitter';
import { EVENT_FLASH, EVENT_SCENE, EVENT_STEALTH } from './constant';
import { getCommon } from './database';
import { decreaseGoods } from './dataManager';
import { canUseFlash } from './app';

export const GOODS_WORLD_USE3: { [x in number]: (hero: Hero, goods: Goods) => boolean } = {
  3002: g3002,
  3005: g3005,
  3006: g3006,
}


/**隐身符 */
function g3002(hero: Hero, goods: Goods) {
  decreaseGoods(goods, 1)
  emit(EVENT_STEALTH)
  return true
}

/**闪退符 */
function g3005(hero: Hero, goods: Goods) {
  let c = getCommon()
  if (c.scene_s != '000') {
    decreaseGoods(goods, 1)
    emit(EVENT_SCENE, '000', c.leaveWorldX_16, c.leaveWorldY_16)
    return true
  }

  warnText('什么都没发生')
  return false
}

/**缩地符 */
function g3006(hero: Hero, goods: Goods) {
  let p = canUseFlash()
  if (p) {
    decreaseGoods(goods, 1)
    emit(EVENT_FLASH, p)
    return true
  }

  return false
}
