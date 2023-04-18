import { tipsText, warnText } from "../component/AppTips"
import { Goods } from "../model/Goods"
import Hero from "../model/Hero"
import { emit } from "../utils/emitter"
import { remove } from "../utils/others"
import { playSound } from "../utils/sound"
import { getHeroName, canUseFlash } from './app';
import { EVENT_FLASH, EVENT_STEALTH } from "./constant"

function uselessTips() {
  warnText('无效施展')
}

export const GOODS_WORLD_USE4: { [x in number]: (hero: Hero, goods: Goods) => boolean } = {
  4002: g4002,
  4006: g4006,
  4007: g4007,
  4008: g4008,
  4010: g4010,
}

/**回神术 */
function g4002(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.hp_32 < hero.maxHp_32) {
    playSound('effect_1')

    hero.hp_32 += 100
    if (hero.hp_32 > hero.maxHp_32) {
      hero.hp_32 = hero.maxHp_32
    }

    tipsText(`${getHeroName(hero)}恢复100点体力`)

    return true
  }

  uselessTips()
  return false
}

/**隐身术 */
function g4006(hero: Hero, goods: Goods) {
  emit(EVENT_STEALTH)
  return true
}

/**缩地术 */
function g4007(hero: Hero, goods: Goods) {
  let p = canUseFlash()
  if (p) {
    emit(EVENT_FLASH, p)
    return true
  }

  return false
}

/**解毒术 */
function g4008(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.status_a.includes(1)) {
    playSound('effect_1')

    remove(1, hero.status_a)
    tipsText(`${getHeroName(hero)}已解毒`)

    return true
  }

  uselessTips()
  return false
}

/**返神术 */
function g4010(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.hp_32 < hero.maxHp_32) {
    playSound('effect_1')

    hero.hp_32 += 600
    if (hero.hp_32 > hero.maxHp_32) {
      hero.hp_32 = hero.maxHp_32
    }

    tipsText(`${getHeroName(hero)}恢复600点体力`)

    return true
  }

  uselessTips()
  return false
}
