///与角色的状态buff相关
import { ceil } from '../utils/math';
import { getHeros } from './database';
import { emit } from '../utils/emitter';
import { EVENT_UPDATE_LEFT_TOP, EVENT_OPEN_ALL_DIE_PANEL } from './constant';
import { BattleObjectItem } from './battleEffects';
import { remove } from '../utils/others';
import { XBattleOgresItem } from '../component/BattleOgresItem';
import { playSound } from '../utils/sound';

/**每移动一格检查角色状态，例如中毒等，返回是否还能继续行动 */
export function testHeroStatus() {
  let isPoison = false

  let heros = getHeros()

  heros.forEach(h => {
    if (h.hp_32 > 0) {
      if (h.status_a.includes(1)) {
        //中毒
        isPoison = true
        let v = ceil(h.maxHp_32 * 0.01)
        h.hp_32 -= v
        if (h.hp_32 < 0) {
          h.hp_32 = 0
        }
      }
    }
  })

  if (isPoison) {
    playSound('effect_6')
    emit(EVENT_UPDATE_LEFT_TOP)
  }

  let allDie = heros.filter(h => h.hp_32 > 0).length == 0
  if (allDie) {
    emit(EVENT_OPEN_ALL_DIE_PANEL)
  }

  return !allDie
}

/**妖怪恢复法力 */
export function restoreOgreMp(ogres: XBattleOgresItem[]) {
  ogres.forEach(o => {
    let d = o.data
    if (d.restore_16) {
      d.mp_16 += d.restore_16
      if (d.mp_16 > d.maxMp_16) {
        d.mp_16 = d.maxMp_16
      }
      o.update()
    }
  })
}


/**战斗每回合检查一次状态，返回是否延迟开始回合 */
export function testBattleObjectStatus(objects: BattleObjectItem[]) {
  let isDelay = false

  objects.forEach(o => {
    let data = o.data

    if (data.status_a.includes(4)) { //清除临时冰冻状态
      remove(4, data.status_a)
    }

    if (data.hp_32 > 0 && data.status_a.includes(1)) { //中毒
      let v = ceil(data.maxHp_32 * 0.01)
      data.hp_32 -= v
      if (data.hp_32 < 0) {
        data.hp_32 = 0
      }

      o.hurt(v)
      isDelay = true
    }

    o.update()
  })

  if (isDelay) {
    playSound('effect_6')
  }

  return isDelay
}