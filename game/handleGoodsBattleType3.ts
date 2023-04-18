import Hero from "../model/Hero"
import Ogre from "../model/Ogre"
import { tempData } from "./dataTemp"

type Data = Hero | Ogre

export const GOODS_BATTLE_USE3: { [x in number]: (target: Data, allies: Data[], enemies: Data[]) => void } = {
  3001: g3001,
  3003: g3003,
  3004: g3004,
  3007: g3007,
}

/**土遁符 */
function g3001(target: Data, allies: Data[], enemies: Data[]) {
  tempData.battleEscape = true
}

/**冰冻符 */
function g3003(target: Data, allies: Data[], enemies: Data[]) {
  if (!target.status_a.includes(4)) {
    target.status_a.push(4)
  }
}

/**火球符 */
function g3004(target: Data, allies: Data[], enemies: Data[]) {
  target.hp_32 -= 150
  if (target.hp_32 < 0) {
    target.hp_32 = 0
  }
}

/**水柱符 */
function g3007(target: Data, allies: Data[], enemies: Data[]) {
  enemies.forEach(t => {
    if (t.hp_32 > 0) {
      t.hp_32 -= 200
      if (t.hp_32 < 0) {
        t.hp_32 = 0
      }
    }
  })
}