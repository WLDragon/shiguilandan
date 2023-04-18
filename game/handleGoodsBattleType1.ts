import Hero from "../model/Hero"
import Ogre from "../model/Ogre"
import { remove } from "../utils/others"

type Data = Hero | Ogre

export const GOODS_BATTLE_USE1: { [x in number]: (target: Data, allies: Data[], enemies: Data[]) => void } = {
  1001: g1001,
  1003: g1003,
  1004: g1004,
  1005: g1005,
  1008: g1008,
  1009: g1009,
}

/**参丸 */
function g1001(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 += 30
  if (target.hp_32 > target.maxHp_32) {
    target.hp_32 = target.maxHp_32
  }
}

/**清毒丹 */
function g1003(target: Data, allies: Data[], enemies: Data[]) {
  remove(1, target.status_a)
}

/**回神丹 */
function g1004(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 += 100
  if (target.hp_32 > target.maxHp_32) {
    target.hp_32 = target.maxHp_32
  }
}

/**集灵草 */
function g1005(target: Data, allies: Data[], enemies: Data[]) {
  target.mp_16 += 30
  if (target.mp_16 > target.maxMp_16) {
    target.mp_16 = target.maxMp_16
  }
}

/**返神丹 */
function g1008(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 += 600
  if (target.hp_32 > target.maxHp_32) {
    target.hp_32 = target.maxHp_32
  }
}

/**养灵丹 */
function g1009(target: Data, allies: Data[], enemies: Data[]) {
  target.mp_16 += 100
  if (target.mp_16 > target.maxMp_16) {
    target.mp_16 = target.maxMp_16
  }
}