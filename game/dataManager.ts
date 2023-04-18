import { Goods } from '../model/Goods';
import { getTeam, getGoodsContainerByType, initDatabase, getCommon, addHero, getHeros, getScene } from './database';
import { _GoodsQuantity } from '../model/notype/_GoodsQuantity';
import { warnText, tipsText } from '../component/AppTips';
import { remove } from '../utils/others';
import { floor } from '../utils/math';
import Hero from '../model/Hero';
import { upgrade2Level, getConfigHeroById, getHeroName, getGoodsById, getUpgrade } from './app';
import { tempData } from './dataTemp';
import { hideMaskQuickly, showMaskSlowly } from '../component/AppMask';
import { emit } from '../utils/emitter';
import { EVENT_SCENE_REFRESH, EVENT_UPDATE_LEFT_TOP } from './constant';
import { DotHero } from '../model/notype/DotHero';
import { playSound } from '../utils/sound';

export function createFirstHero(heroRoots: number[]) {
  let h = new Hero
  h.id_16 = 1
  h.surname_s = '龙'
  h.name_s = '傲天'
  h.skin_s = 'h001'
  h.roots_a = heroRoots
  h.grade_8 = 0
  h.level_8 = 0

  upgrade2Level(h, 0)
  initDatabase(h)

  let c = getCommon()
  c.scene_s = '101'
  c.sceneX_16 = 13
  c.sceneY_16 = 3
}

export function buy(goods: Goods, quantity: number) {
  let team = getTeam()
  let fee = goods.price_32 * quantity
  if (team.gem_32 >= fee) {
    playSound('buy')

    team.gem_32 -= fee
    increaseGoods(goods, quantity)
    tipsText(`${goods.name_s}+${quantity}`)

  } else {
    warnText('灵石不够，需要' + fee)
  }
}

export function sale(goods: Goods, quantity: number) {
  let team = getTeam()

  if (decreaseGoods(goods, quantity)) {
    playSound('sale')
    let gem = floor(goods.price_32 * 0.8) * quantity
    team.gem_32 += gem
    tipsText(`灵石+${gem}`)

  } else {
    warnText('没有足够的【' + goods.name_s + '】')
  }
}

/**增加物品到背包 */
export function increaseGoods(goods: Goods, quantity: number) {
  let arr = getGoodsContainerByType(goods.type_8)

  let gq = arr.find(g => g.i == goods.id_16)
  if (!gq) {
    gq = new _GoodsQuantity(goods.id_16, 0)
    arr.push(gq)
  }
  gq.n += quantity
  if (gq.n > 99999) {
    gq.n = 99999
  }
}

/**从背包减少物品 */
export function decreaseGoods(goods: Goods, quantity: number): boolean {
  let arr = getGoodsContainerByType(goods.type_8)

  let gq = arr.find(g => g.i == goods.id_16)
  if (gq && gq.n >= quantity) {
    gq.n -= quantity
    if (gq.n <= 0) {
      remove(gq, arr)
    }
    return true

  } else {
    return false
  }
}

export function getGoodsQuantity(goodsId: number): number {
  let a = getGoodsContainerByType(getGoodsById(goodsId).type_8)
  let b = a.find(c => c.i == goodsId)
  if (b) {
    return b.n
  }

  return 0
}

export function sleepInHotel(price: number) {
  let team = getTeam()
  let liveHeros = getHeros().filter(h => h.hp_32 > 0)
  let fee = liveHeros.length * price
  if (team.gem_32 >= fee) {
    team.gem_32 -= fee
    liveHeros.forEach(h => {
      h.hp_32 = h.maxHp_32
      h.mp_16 = h.maxMp_16
    })

    tempData.isStopMove = true
    showMaskSlowly(() => {
      playSound('effect_1')
      tempData.isStopMove = false
      emit(EVENT_UPDATE_LEFT_TOP)
      hideMaskQuickly()
    }, 1000)

  } else {
    warnText(`您的灵石不够，需要${fee}`)
  }
}

export function addNewPartner(dot: DotHero) {
  let hero = new Hero
  let conf = getConfigHeroById(dot.hero)
  for (let k in conf) {
    hero[k] = conf[k]
  }

  let totalLevel = hero.grade_8 * 10 + hero.level_8
  let upGradeConfig = getUpgrade(totalLevel - 1)
  upgrade2Level(hero, totalLevel)
  hero.exp_32 = upGradeConfig.upgrade_32 + 1
  addHero(hero)
  emit(EVENT_UPDATE_LEFT_TOP)
  tipsText(`${getHeroName(hero)}加入队伍`)

  //移除地图上的人物，把位置挪远，场景会自动移除
  dot.x = -100
  dot.y = -100
  dot.r = 1
  let scene = getScene(getCommon().scene_s)
  remove(dot, scene.nearDots_o)
  emit(EVENT_SCENE_REFRESH)
}