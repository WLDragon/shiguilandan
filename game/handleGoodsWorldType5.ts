import { Goods } from "../model/Goods"
import Hero from "../model/Hero"
import { findAheadNearDot, getCommon, getScene, getTeam } from './database';
import { DotRole } from '../model/notype/DotRole';
import { decreaseGoods, getGoodsQuantity, increaseGoods } from './dataManager';
import { emit } from "../utils/emitter";
import { EVENT_DIALOG, EVENT_INQUIRE, EVENT_SCENE_REFRESH } from "./constant";
import { tipsText, warnText } from '../component/AppTips';
import { DotShop } from '../model/notype/DotShop';
import { getGoodsById } from "./app";
import { DotNpc } from '../model/notype/DotNpc';

function nothing() { warnText('什么都没发生') }

export const GOODS_WORLD_USE5: { [x in number]: (hero: Hero, goods: Goods) => boolean } = {
  5001: g5001,
  5002: g5002,
  5003: g5003,
  5004: g5004,
  5005: g5005,
  5006: g5006,
  5007: g5007,
  5008: g5008,
  5009: g5009,
  5010: g5010,
  5011: g5011,
  5012: g5012,
  5013: g5013,
}

/**引仙令 */
function g5001(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '106' && dot && dot.id == 20) {
    decreaseGoods(goods, 1)

    if (c.sceneX_16 != 31) {
      dot.x = 31
    } else {
      dot.x = 29
    }
    dot.message = 10615
    dot.r = 1

    let r13 = getScene('106').nearDots_o.find(r => r.id == 13) as DotRole
    r13.message = 10614
    r13.x = 14

    emit(EVENT_SCENE_REFRESH)
    tipsText('进去吧')

    return true

  }

  nothing()
  return false
}

/**玉如意 */
function g5002(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '110' && dot && dot.id == 2) {
    decreaseGoods(goods, 1)
    dot.x = 7
    dot.r = 1
    dot.message = 11003

    emit(EVENT_SCENE_REFRESH)
    tipsText('请进')

    return true
  }

  nothing()
  return false
}

/**隐身符印章 */
function g5003(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotShop
  if (c.scene_s == '106' && dot && dot.id == 3) {
    decreaseGoods(goods, 1)

    dot.goods.push(3002)
    increaseGoods(getGoodsById(3002), 3)
    tipsText('获得【隐身符】x3')

    return true
  }

  nothing()
  return false
}

/**青斑白玉镯 */
function g5004(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole

  if (c.scene_s == '119' && dot && dot.id == 2) {
    //交给海王真人
    dot.message = 11902
    decreaseGoods(goods, 1)
    let ng = getGoodsById(5005)
    increaseGoods(ng, 1)
    tipsText(`获得【${ng.name_s}】`)

  } else if (c.scene_s == '116' && dot && dot.id == 15) {
    //交还王富贵
    decreaseGoods(goods, 1)
    getTeam().gem_32 += 1000
    tipsText('获得1000灵石')

    return true
  }

  nothing()
  return false
}

/**慑妖珠 */
function g5005(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '119' && dot && dot.id == 2) {
    //交还海王真人
    dot.message = 11903
    decreaseGoods(goods, 1)
    let ng = getGoodsById(5004)
    increaseGoods(ng, 1)
    tipsText(`获得【${ng.name_s}】`)

    return true
  }

  nothing()
  return false
}

/**青鼠晶 */
function g5006(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '122' && dot && dot.id == 1) {
    if (getGoodsQuantity(5006) >= 10) {
      decreaseGoods(goods, 10)
      increaseGoods(getGoodsById(4007), 1)
      tipsText('获得【缩地术】')

      dot.id = 10
      dot.message = 12208

      let scene122 = getScene('122')
      let d2 = scene122.nearDots_o.find(d => d.id == 2) as DotNpc
      d2.message = 12209
      d2.x = d2.ox = 2
      d2.y = d2.oy = 15
      d2.w = 5
      d2.h = 2
      d2.r = 1

      //商店添加缩地符
      let shop = scene122.nearDots_o.find(d => d.id == 8) as DotShop
      shop.goods.push(3006)

    } else {
      warnText('数量不够，需要10颗')
    }

    return true
  }

  nothing()
  return false
}

/**木材 */
function g5007(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '125' && dot && dot.id == 2) {
    decreaseGoods(goods, 1)
    let g = getGoodsById(5008)
    increaseGoods(g, 1)

    dot.message = 12502

    tipsText(`获得【${g.name_s}】`)

    return true
  }

  nothing()
  return false
}

/**小舟 */
function g5008(hero: Hero, goods: Goods) {
  nothing()
  return false
}

/**花 */
function g5009(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotNpc
  if (c.scene_s == '100' && dot && dot.id == 15) {
    decreaseGoods(goods, 1)

    dot.message = 10004
    let s100 = getScene('100')
    let r11 = s100.nearDots_o.find(d => d.id == 11) as DotRole
    r11.goods = 5001
    r11.message = 10002

    emit(EVENT_SCENE_REFRESH)
    emit(EVENT_DIALOG, dot)

    return true
  }

  nothing()
  return false
}

/**遗物 */
function g5010(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotNpc
  if (c.scene_s == '120' && dot && dot.id == 2) {
    decreaseGoods(goods, 1)

    dot.message = 12002
    emit(EVENT_SCENE_REFRESH)
    emit(EVENT_DIALOG, dot)

    return true
  }

  nothing()
  return false
}

/**神木 */
function g5011(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotNpc
  if (c.scene_s == '120' && dot && dot.id == 2 && dot.message == 12002) {
    decreaseGoods(goods, 1)

    //交给王豆，dot由义工变成英雄
    dot.id = 10
    dot['hero'] = 3
    dot.message = 12003
    dot.type = 13
    dot.r = 1
    emit(EVENT_INQUIRE, dot)

    return true
  }

  nothing()
  return false
}

/**紫天参 */
function g5012(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '131' && dot && dot.id == 12) {
    if (getGoodsQuantity(5012) >= 15) {
      decreaseGoods(goods, 15)
      increaseGoods(getGoodsById(1008), 3)
      tipsText('获得【返神丹】x3')

      dot.id = 20
      dot.message = 13110
      emit(EVENT_SCENE_REFRESH)
      emit(EVENT_DIALOG, dot)

      //商店添加返神丹和十万灵石
      let scene131 = getScene('131')
      let shop = scene131.nearDots_o.find(d => d.id == 2) as DotShop
      shop.goods.push(1008)

      //安排父亲的剧情
      let scene101 = getScene('101')
      let i = scene101.nearDots_o.findIndex(d => d.id == 1)
      if (i > -1) {
        scene101.nearDots_o.splice(i, 1)
      }
      let d3 = scene101.nearDots_o.find(d => d.id == 3) as DotNpc
      d3.message = 10103

      let scene100 = getScene('100')
      let d11 = scene100.nearDots_o.find(d => d.id == 11) as DotRole
      d11.goods = 5013
      d11.message = 10010
      d11.skin = 'h007'

    } else {
      warnText('数量不够，需要15根')
    }

    return true
  }

  nothing()
  return false
}

/**十万灵石 */
function g5013(hero: Hero, goods: Goods) {
  let c = getCommon()
  let dot = findAheadNearDot() as DotRole
  if (c.scene_s == '131' && dot && dot.id == 20) {
    decreaseGoods(goods, 1)
    increaseGoods(getGoodsById(1007), 1)
    tipsText('获得【筑基丹】')

    dot.id = 21
    dot.message = 13111
    emit(EVENT_SCENE_REFRESH)
    emit(EVENT_DIALOG, dot)

    //商店添加筑基丹
    let scene131 = getScene('131')
    let shop = scene131.nearDots_o.find(d => d.id == 2) as DotShop
    shop.goods.push(1007)

    return true
  }

  nothing()
  return false
}