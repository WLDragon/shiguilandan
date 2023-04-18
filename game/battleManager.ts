import { Action } from '../model/notype/Action';
import { emit } from '../utils/emitter';
import { EVENT_BATTLE_CHOOSE_ACTION, EVENT_BATTLE_ACTION, EVENT_STOP_HERO_PLAY, EVENT_BATTLE_RESULT, EVENT_BATTLE_NEW_TURN } from './constant';
import { tempData } from './dataTemp';
import Hero from '../model/Hero';
import Ogre from '../model/Ogre';
import { ceil, floor, random } from '../utils/math';
import { getGoodsById, upgrade2Level } from './app';
import { decreaseGoods, increaseGoods } from './dataManager';
import { Goods } from '../model/Goods';
import { getTeam, getHeros, getCommon } from './database';
import { GoodsMagic } from '../model/GoodsMagic';
import { showMaskSlowly } from '../component/AppMask';
import { back } from '../utils/router';
import { linkDotsAfterBattle } from './dotsManagerLink';

let actions: Action[]
let heroIndex: number
let currentHero: Hero
/**活着的英雄 */
let aliveHeros: Hero[]
let aliveOgres: Ogre[]

export function newBattleTurn() {
  actions = []
  heroIndex = 0

  //TODO 后期添加封印状态
  aliveHeros = tempData.battleHeros.filter(h => h.hp_32 > 0)
  aliveOgres = tempData.battleOgres.filter(o => o.hp_32 > 0)

  if (tempData.battleAutoAction) {
    enableAutoBattle(true)

  } else {
    nextHeroPrepare()
  }
}

export function testActionLength() {
  return actions.length > 0
}

function nextHeroPrepare() {
  if (heroIndex < aliveHeros.length) {
    currentHero = aliveHeros[heroIndex++]
    emit(EVENT_BATTLE_CHOOSE_ACTION, currentHero)

  } else {
    emit(EVENT_STOP_HERO_PLAY)
    enemyPrepare()
  }
}

function enemyPrepare() {
  //妖兽的攻击方式：有法术且法力足够就使用法术（小怪50%机率会使用），否则就物理攻击。随机选一个人来打就可以
  aliveOgres.forEach(o => {
    if (o.magics_a.length) {
      let m = o.magics_a[floor(random() * o.magics_a.length)]
      let g = getGoodsById(m) as GoodsMagic
      if (o.mp_16 >= g.mp_16 && random() < 0.5) {
        createOgreMagicAction(o, aliveHeros, g.id_16)
      } else {
        createOgreAttackAction(o, aliveHeros)
      }

    } else {
      createOgreAttackAction(o, aliveHeros)
    }
  })

  //行动顺序按敏捷低到高排序
  actions.sort((a, b) => a.agile - b.agile)
  executeNextAction()
}

function createOgreAttackAction(ogre: Ogre, heros: Hero[]) {
  let a = new Action
  a.isUser = false
  a.target = heros[floor(random() * heros.length)].id_16
  a.source = ogre.id_16
  a.type = 1
  a.agile = ogre.agile_16

  actions.push(a)
}

function createOgreMagicAction(ogre: Ogre, heros: Hero[], goodsId: number) {
  let g = getGoodsById(goodsId)
  let t = g.for_8 == 1 ? ogre.id_16 : heros[floor(random() * heros.length)].id_16

  let a = new Action
  a.isUser = false
  a.target = t
  a.source = ogre.id_16
  a.type = 2
  a.agile = ogre.agile_16
  a.goodsId = goodsId

  actions.push(a)
}

export function createUserAction(targetId: number) {
  let a = new Action
  a.isUser = true
  a.target = targetId
  a.source = currentHero.id_16
  a.type = tempData.battleType
  a.agile = currentHero.agile_16 + currentHero.agileEx_16
  a.goodsId = tempData.battleGoodsId

  actions.push(a)

  if (a.type == 3 || a.type == 4) {
    decreaseGoods(getGoodsById(a.goodsId), 1)
  }

  nextHeroPrepare()
}

export function cancelActionChoose() {
  if (actions.length) {
    let a = actions.pop()
    returnActionGoods(a)
    let i = aliveHeros.findIndex(h => h.id_16 == a.source)
    heroIndex = i
    nextHeroPrepare()
  }
}

export function enableAutoBattle(value: boolean) {
  tempData.battleAutoAction = value
  if (value) {
    emit(EVENT_STOP_HERO_PLAY)

    let i = heroIndex == 0 ? 0 : heroIndex - 1
    let poisonOgres = aliveOgres.filter(o => o.magics_a.includes(4001))
    for (; i < aliveHeros.length; i++) {
      let h = aliveHeros[i]
      let a = new Action
      //优先攻击带毒的妖兽，因为不清楚需要几回合可以击杀一只带毒妖兽，所以集中攻击第一个
      a.target = poisonOgres.length ? poisonOgres[0].id_16 : aliveOgres[0].id_16
      a.agile = h.agile_16 + h.agileEx_16
      a.source = h.id_16
      a.isUser = true
      a.type = 1

      actions.push(a)
    }

    enemyPrepare()
  }
}

export function checkBattleOver(): boolean {
  let allHeroDie = tempData.battleHeros.filter(h => h.hp_32 > 0).length == 0
  let allOgreDie = tempData.battleOgres.filter(o => o.hp_32 > 0).length == 0

  if (allHeroDie || allOgreDie) {
    //战斗结束
    actions.forEach(a => returnActionGoods(a))
    emit(EVENT_BATTLE_RESULT, allOgreDie == true)
    return true
  }

  return false
}

export function executeNextAction() {
  if (tempData.battleEscape) {
    //逃跑
    tempData.battleEscape = false
    showMaskSlowly(() => {
      back()
    })
    return
  }

  if (!checkBattleOver()) {
    if (actions.length) {
      let a = actions.pop()
      //发起方无法行动则进入下一个行动
      let sourceData = getObjectData(a.source)
      if (sourceData.hp_32 == 0 || sourceData.status_a.includes(4)) {
        returnActionGoods(a)
        requestAnimationFrame(executeNextAction)

      } else {
        if (a.target) {
          //目标方死亡则随机攻击一个敌人（优化攻击带毒的）
          let t = getObjectData(a.target)
          if (!t || t.hp_32 == 0) {
            let newTarget: number
            if (a.isUser) {
              let os = aliveOgres.filter(o => o.hp_32 > 0)
              let poisonOgres = os.filter(o => o.magics_a.includes(4001))
              newTarget = poisonOgres.length ? poisonOgres[0].id_16 : os[floor(random() * os.length)].id_16

            } else {
              let hs = aliveHeros.filter(h => h.hp_32 > 0)
              newTarget = hs[floor(random() * hs.length)].id_16
            }
            a.type = 1
            a.target = newTarget
          }
        }

        emit(EVENT_BATTLE_ACTION, a)
      }

    } else {
      emit(EVENT_BATTLE_NEW_TURN)
    }
  }
}

function getObjectData(id: number): Hero | Ogre {
  if (id > 100) {
    return aliveOgres.find(o => o.id_16 == id)
  } else {
    return aliveHeros.find(h => h.id_16 == id)
  }
}

function returnActionGoods(a: Action) {
  //行动没执行需要归还物品
  if (a.type == 3 || a.type == 4) {
    increaseGoods(getGoodsById(a.goodsId), 1)
  }
}



export type HeroExpStatus = {
  hero: Hero,
  exp: number,
  /**0-不显示 1-升级 2-阵亡（阵亡是没有经验的） */
  status: number,
  rate: number
}

/**分配经验，阵亡的人不吸收经验*/
export function allocExps(exp: number): HeroExpStatus[] {
  let hes: HeroExpStatus[] = []
  tempData.battleHeros.forEach(h => {
    let rate = 1.1 - h.roots_a.length * 0.1
    hes.push({ hero: h, exp: 0, status: (h.hp_32 > 0 ? 0 : 2), rate })
  })

  if (exp > 0) {
    let alives = hes.filter(h => h.status != 2)
    let n = alives.length
    let per = floor(exp / n)
    let rem = exp % n
    alives.forEach(a => {
      a.exp = per
      if (rem > 0) {
        rem--
        a.exp += 1
      }

      //吸收效率
      a.exp = ceil(a.exp * a.rate)

      //当为层级为9时需要突破物品才能升级
      if ((a.hero.level_8 != 9) && (a.hero.exp_32 + a.exp >= a.hero.maxExp_32)) {
        a.status = 1
      }
    })
  }

  return hes
}

export function handleResult(hes: HeroExpStatus[], gem: number, goods: Goods) {
  hes.forEach(h => {
    let hero = h.hero
    hero.exp_32 += h.exp
    if (hero.exp_32 >= hero.maxExp_32) {
      if (hero.level_8 < 9) {
        hero.level_8++
        upgrade2Level(hero, hero.grade_8 * 10 + hero.level_8)
      }
    }
  })

  getTeam().gem_32 += gem
  if (goods) {
    increaseGoods(goods, 1)
  }

  if (tempData.battleBossDot) {
    tempData.battleBossDot.ogres.length = 0

    linkDotsAfterBattle(getCommon().scene_s)
  }
}

export function reborn(heroId = 0) {
  getHeros().forEach(h => {
    if (heroId == h.id_16 || heroId == 0) {
      h.hp_32 = h.maxHp_32
      h.mp_16 = h.maxMp_16
      h.status_a.length = 0
    }
  })
}