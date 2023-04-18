import Hero from '../model/Hero';
import { Goods } from '../model/Goods';
import { decreaseGoods } from './dataManager';
import { tipsText, warnText } from '../component/AppTips';
import { getHeroName, upgrade2Level } from './app';
import { remove } from '../utils/others';
import { floor } from '../utils/math';
import { playSound } from '../utils/sound';

function uselessTips() {
  warnText('无效使用')
}

export const GOODS_WORLD_USE1: { [x in number]: (hero: Hero, goods: Goods) => boolean } = {
  1001: g1001,
  1002: g1002,
  1003: g1003,
  1004: g1004,
  1005: g1005,
  1006: g1006,
  1007: g1007,
  1008: g1008,
  1009: g1009,
}

/**参丸 */
function g1001(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.hp_32 < hero.maxHp_32) {
    playSound('effect_1')

    hero.hp_32 += 30
    if (hero.hp_32 > hero.maxHp_32) {
      hero.hp_32 = hero.maxHp_32
    }

    decreaseGoods(goods, 1)
    tipsText(`${getHeroName(hero)}恢复30点体力`)

    return true
  }

  uselessTips()
  return false
}

/**聚气丹 */
function g1002(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0) {
    if (hero.grade_8 == 0 && hero.level_8 == 9 && hero.exp_32 >= hero.maxExp_32) {
      playSound('upgrade')

      hero.grade_8 = 1
      hero.level_8 = 0
      decreaseGoods(goods, 1)
      upgrade2Level(hero, 10)
      tipsText(`${getHeroName(hero)}突破至【炼气境】`)

    } else {
      warnText('没达到使用条件')
    }

    return true
  }

  uselessTips()
  return false
}

/**清毒丹 */
function g1003(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.status_a.includes(1)) {
    playSound('effect_1')

    remove(1, hero.status_a)
    decreaseGoods(goods, 1)
    tipsText(`${getHeroName(hero)}已解毒`)

    return true
  }

  uselessTips()
  return false
}

/**回神丹 */
function g1004(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.hp_32 < hero.maxHp_32) {
    playSound('effect_1')

    hero.hp_32 += 100
    if (hero.hp_32 > hero.maxHp_32) {
      hero.hp_32 = hero.maxHp_32
    }

    decreaseGoods(goods, 1)
    tipsText(`${getHeroName(hero)}恢复100点体力`)

    return true
  }

  uselessTips()
  return false
}

/**集灵草 */
function g1005(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.mp_16 < hero.maxMp_16) {
    playSound('effect_1')

    hero.mp_16 += 30
    if (hero.mp_16 > hero.maxMp_16) {
      hero.mp_16 = hero.maxMp_16
    }

    decreaseGoods(goods, 1)
    tipsText(`${getHeroName(hero)}恢复30点法力`)

    return true
  }

  uselessTips()
  return false
}

/**还魂丹 */
function g1006(hero: Hero, goods: Goods) {
  if (hero.hp_32 == 0) {
    decreaseGoods(goods, 1)

    hero.hp_32 = floor(hero.maxHp_32 * 0.5)
    hero.status_a.length = 0
    tipsText(`${getHeroName(hero)}已复活`)

    return true
  }

  uselessTips()
  return false
}

/**筑基丹 */
function g1007(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0) {
    playSound('upgrade')

    if (hero.grade_8 == 1 && hero.level_8 == 9 && hero.exp_32 >= hero.maxExp_32) {
      hero.grade_8 = 2
      hero.level_8 = 0
      decreaseGoods(goods, 1)
      tipsText(`${getHeroName(hero)}突破至【筑基境】`)

    } else {
      warnText('没达到使用条件')
    }

    return true
  }

  uselessTips()
  return false
}

/**返神丹 */
function g1008(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.hp_32 < hero.maxHp_32) {
    playSound('effect_1')

    hero.hp_32 += 600
    if (hero.hp_32 > hero.maxHp_32) {
      hero.hp_32 = hero.maxHp_32
    }

    decreaseGoods(goods, 1)
    tipsText(`${getHeroName(hero)}恢复600点体力`)

    return true
  }

  uselessTips()
  return false
}

/**养灵丹 */
function g1009(hero: Hero, goods: Goods) {
  if (hero.hp_32 > 0 && hero.mp_16 < hero.maxMp_16) {
    playSound('effect_1')

    hero.mp_16 += 100
    if (hero.mp_16 > hero.maxMp_16) {
      hero.mp_16 = hero.maxMp_16
    }

    decreaseGoods(goods, 1)
    tipsText(`${getHeroName(hero)}恢复100点法力`)

    return true
  }

  uselessTips()
  return false

}
