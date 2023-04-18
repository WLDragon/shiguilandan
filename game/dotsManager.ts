import { DotTeleport } from '../model/notype/DotTeleport';
import { emit } from '../utils/emitter';
import { EVENT_SCENE, EVENT_DIALOG, EVENT_REMOVE_DOT, EVENT_SHOP, EVENT_INQUIRE } from './constant';
import { Dot } from '../model/notype/Dot';
import { getCommon, getTeam, removeSceneDot } from './database';
import { DotTreasure } from '../model/notype/DotTreasure';
import { getGoodsById } from './app';
import { GoodsGem } from '../model/GoodsGem';
import { tipsText } from '../component/AppTips';
import { increaseGoods } from './dataManager';
import { DotRole } from '../model/notype/DotRole';
import { DotBoss } from '../model/notype/DotBoss';
import { tempData } from './dataTemp';
import { showMaskSlowly } from '../component/AppMask';
import { to } from '../utils/router';
import { playSound } from '../utils/sound';

/**返回是否继续前进 */
export function testkDots(x: number, y: number, dots: Dot[]): boolean {
  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i]
    if (dot.x == x && dot.y == y) {
      if (HANDLES[dot.type]) {
        return HANDLES[dot.type](dot)
      } else {
        throw Error('no Dot handle' + dot.type)
      }
    }
  }

  return true
}

const HANDLES: { [x in number]: (dot: Dot) => boolean } = {
  '1': handle1,
  '2': handle2,
  '3': handle3,
  '4': handle4,
  '5': handle5,
  '6': handle6,
  '7': handle7,
  '8': handle8,
  '9': handle9,
  '10': handle10,
  '11': handle11,
  '12': handle12,
  '13': handle13,
  '14': handle14,
}

/**传送 */
function handle1(dot: DotTeleport): boolean {
  let c = getCommon()
  if (c.scene_s == '000' && dot.scene != '000') {
    c.leaveWorldX_16 = dot.x
    c.leaveWorldY_16 = dot.y
  }
  emit(EVENT_SCENE, dot.scene, dot.sx, dot.sy)
  return false
}

/**障碍 */
function handle2(dot: Dot): boolean {
  return false
}

/**宝箱 */
function handle3(dot: DotTreasure): boolean {
  playSound('get')

  let g = getGoodsById(dot.goods)
  if (g.type_8 == 6) {
    getTeam().gem_32 += (g as GoodsGem).gems_16
    tipsText(`捡到${(g as GoodsGem).gems_16}灵石`)

  } else {
    increaseGoods(g, 1)
    tipsText(`捡到【${g.name_s}】`)
  }

  removeSceneDot(getCommon().scene_s, dot, false)
  if (dot.tile) {
    emit(EVENT_REMOVE_DOT, dot)
  }
  return true
}

/**阶梯 */
function handle4(dot: Dot): boolean {

  return true
}

/**开关 */
function handle5(dot: Dot): boolean {

  return false
}

/**大风 */
function handle6(dot: Dot): boolean {

  return false
}

/**路人 */
function handle7(dot: Dot): boolean {
  emit(EVENT_DIALOG, dot)
  return false
}

/**大牛 */
function handle8(dot: DotBoss): boolean {
  if (dot.ogres.length) {
    tempData.isStopMove = true
    tempData.battleBossDot = dot
    showMaskSlowly(() => {
      to('Battle', dot)
    })

  } else {
    emit(EVENT_DIALOG, dot)
  }

  return false
}

/**义工 */
function handle9(dot: DotRole): boolean {
  emit(EVENT_DIALOG, dot)

  if (dot.goods) {
    playSound('get')
    let g = getGoodsById(dot.goods)
    increaseGoods(g, 1)
    tipsText(`获得【${g.name_s}】`)
    dot.goods = 0 //只能获取一次
  }

  return false
}

/**商店 */
function handle10(dot: Dot): boolean {
  playSound('ask')
  emit(EVENT_SHOP, dot)
  return false
}

/**医生 */
function handle11(dot: Dot): boolean {

  return false
}

/**道士 */
function handle12(dot: Dot): boolean {

  return false
}

/**英雄 */
function handle13(dot: Dot): boolean {
  playSound('ask')
  emit(EVENT_INQUIRE, dot)
  return false
}

/**客栈 */
function handle14(dot: Dot): boolean {
  playSound('ask')
  emit(EVENT_INQUIRE, dot)
  return false
}