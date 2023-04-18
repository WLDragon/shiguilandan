import Hero from '../model/Hero';
import Ogre from "../model/Ogre"
import { remove } from "../utils/others"
import { tempData } from "./dataTemp"

type Data = Hero | Ogre

export const GOODS_BATTLE_USE4: { [x in number]: (target: Data, allies: Data[], enemies: Data[]) => void } = {
  4001: g4001,
  4002: g4002,
  4003: g4003,
  4004: g4004,
  4005: g4005,
  4008: g4008,
  4009: g4009,
  4010: g4010,
}

/**噬心毒 */
function g4001(target: Data, allies: Data[], enemies: Data[]) {
  if (!target.status_a.includes(1)) {
    target.status_a.push(1)
  }
}

/**回神术 */
function g4002(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 += 100
  if (target.hp_32 > target.maxHp_32) {
    target.hp_32 = target.maxHp_32
  }
}

/**冰冻术 */
function g4003(target: Data, allies: Data[], enemies: Data[]) {
  if (!target.status_a.includes(4)) {
    target.status_a.push(4)
  }
}

/**火球术 */
function g4004(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 -= 100

  if (target.hp_32 < 0) {
    target.hp_32 = 0
  }
}

/**土遁术 */
function g4005(target: Data, allies: Data[], enemies: Data[]) {
  tempData.battleEscape = true
}

/**解毒术 */
function g4008(target: Data, allies: Data[], enemies: Data[]) {
  remove(1, target.status_a)
}

/**水龙柱 */
function g4009(target: Data, allies: Data[], enemies: Data[]) {
  enemies.forEach(t => {
    if (t.hp_32 > 0) {
      t.hp_32 -= 200
      if (t.hp_32 < 0) {
        t.hp_32 = 0
      }
    }
  })
}

/**返神术 */
function g4010(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 += 600
  if (target.hp_32 > target.maxHp_32) {
    target.hp_32 = target.maxHp_32
  }
}