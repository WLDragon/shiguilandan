import { XBattleOgresItem } from '../component/BattleOgresItem';
import { XBattleHerosItem } from '../component/BattleHerosItem';
import { Container, Sprite, Texture } from 'pixi.js';
import { min } from '../utils/math';
import { ZERO_POINT, WIDTH, HEIGHT } from './constant';
import { Goods } from '../model/Goods';
import { Ease, tween } from '../utils/tween';
import { playSound } from '../utils/sound';
import Hero from '../model/Hero';

export type BattleObjectItem = XBattleOgresItem | XBattleHerosItem

let effectBox: Container

/**检目标是否能被作用到 */
export function canEffectTarget(target: BattleObjectItem): boolean {
  if (target) {
    if (target.data.status_a.includes(101)) {
      return false
    }
  }

  return true
}

export function initEffectContainer(box: Container) {
  effectBox = box
}

export function playAttackEffect(source: BattleObjectItem, target: BattleObjectItem, hurtValue: number) {
  if (source.isHero && ((source.data as Hero).equip_a[0] > 0)) {
    playSound('effect_01')
  } else {
    playSound('effect_00')
  }

  return new Promise<void>(resolve => {
    let global = target.toGlobal(ZERO_POINT)
    let w2 = target.width / 2
    let h2 = target.height / 2
    let w = min(target.width, target.height)

    let s = new Sprite(Texture.from('e001.png'))
    s.width = w
    s.height = w
    s.anchor.set(0.5)
    s.position.set(global.x + w2, global.y + h2)
    effectBox.addChild(s)

    setTimeout(() => {
      s.destroy()
      resolve()
    }, 200)

  }).then(() => target.hurt(hurtValue))
}

export function playGoodsEffects(goods: Goods, target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  return EFFECTS[goods.id_16](target, allies, enemies)
}

const EFFECTS = {
  1001: e1001,
  1003: e1001,
  1004: e1001,
  1005: e1001,
  1008: e1001,
  1009: e1001,
  3001: e4005,
  3003: e4003,
  3004: e4004,
  3007: e4009,
  4001: e4001,
  4002: e1001,
  4003: e4003,
  4004: e4004,
  4005: e4005,
  4008: e1001,
  4009: e4009,
  4010: e1001,
}

function e1001(target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  playSound('effect_1')
  return new Promise<void>(resolve => {
    let global = target.toGlobal(ZERO_POINT)
    let w2 = target.width / 2
    let h2 = target.height / 2
    let w = min(target.width, target.height)

    let s = new Sprite(Texture.from('e002.png'))
    s.scale.set(w / 32)
    s.anchor.set(0.5)
    s.position.set(global.x + w2, global.y + h2)
    effectBox.addChild(s)

    tween(s.position).to({ y: global.y }, 500).onComplete(() => {
      s.destroy()
      resolve()
    })
  })
}

function e4001(target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  playSound('effect_6')
  return new Promise<void>(resolve => {
    let global = target.toGlobal(ZERO_POINT)
    let w2 = target.width / 2
    let h2 = target.height / 2
    let w = min(target.width, target.height)

    let s = new Sprite(Texture.from('e003.png'))
    s.anchor.set(0.5)
    s.scale.set(0)
    s.position.set(global.x + w2, global.y + h2)
    effectBox.addChild(s)

    let r = w / 32 * 1.5

    tween(s.scale).to({ x: r, y: r }, 500, Ease.sineOut).onComplete(() => {
      s.destroy()
      resolve()
    })
  })
}

function e4003(target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  playSound('effect_4')
  return new Promise<void>(resolve => {
    target.update()
    setTimeout(resolve, 200)
  })
}

function e4004(target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  playSound('effect_2')
  return new Promise<void>(resolve => {
    let global = target.toGlobal(ZERO_POINT)
    let w2 = target.width / 2
    let h2 = target.height / 2

    let s = new Sprite(Texture.from('e005.png'))
    s.anchor.set(0.5)
    s.position.set(target.isHero ? WIDTH : 0, 0)
    effectBox.addChild(s)

    tween(s.position).to({ x: global.x + w2, y: global.y + h2 }, 500).onComplete(() => {
      s.destroy()
      resolve()
    })

  }).then(() => target.hurt(canEffectTarget(target) ? 100 : 0))
}

function e4005(target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  playSound('effect_3')
  return new Promise<void>(resolve => {
    let w2 = WIDTH / 2
    let h2 = HEIGHT / 2

    let s = new Sprite(Texture.from('e006.png'))
    s.anchor.set(0.5)
    s.position.set(w2, h2)
    effectBox.addChild(s)

    tween(s).to({ alpha: 0.1 }, 400)
    tween(s.scale).to({ x: 6, y: 6 }, 500, Ease.sineOut).onComplete(() => {
      s.destroy()
      resolve()
    })
  })
}

function e4009(target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  playSound('effect_5')
  let pms: Promise<void>[] = []
  enemies.forEach(t => {
    //全体攻击的对象有可能在上一个角色攻击时就已经死亡，要判断是否被销毁
    if (!t.destroyed) {
      let p = new Promise<void>(resolve => {
        let global = t.toGlobal(ZERO_POINT)

        let s = new Sprite(Texture.from('e007.png'))
        s.position.set(global.x, global.y + t.height)
        s.anchor.set(0, 1)
        s.width = t.width
        s.height = 0
        effectBox.addChild(s)

        tween(s).to({ height: t.height }, 500).onComplete(() => {
          s.destroy()
          resolve()
        })

      }).then(() => t.hurt(canEffectTarget(t) ? 200 : 0))

      pms.push(p)
    }
  })

  return Promise.all(pms)
}