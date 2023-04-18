/// 管理战斗动画结果
import { Action } from '../model/notype/Action';
import { BattleObjectItem, playAttackEffect, playGoodsEffects, canEffectTarget } from './battleEffects';
import { executeNextAction } from './battleManager';
import { useGoodsInBattle } from './handleGoodsBattle';
import { getGoodsById } from './app';

export function handleBattleAction(action: Action, source: BattleObjectItem, target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {

  source.ready(() => {
    if (action.type == 1) {
      handleAttack(source, target)

    } else if (action.type == 2 || action.type == 3 || action.type == 4) {
      handleUseGoods(action, source, target, allies, enemies)
    }
  })
}

function handleAttack(source: BattleObjectItem, target: BattleObjectItem) {
  let hurtValue = source.attack - target.defend
  if (!canEffectTarget(target)) {
    hurtValue = 0 //目标无法被伤害到

  } else if (hurtValue <= 0) {
    hurtValue = 1
  }

  target.data.hp_32 -= hurtValue
  if (target.data.hp_32 < 0) {
    target.data.hp_32 = 0
  }

  //播放攻击动画
  playAttackEffect(source, target, hurtValue)
    .then(() => {
      source.actionEnd()
      target.update()

      executeNextAction()
    })
}

function handleUseGoods(action: Action, source: BattleObjectItem, target: BattleObjectItem, allies: BattleObjectItem[], enemies: BattleObjectItem[]) {
  let goods = getGoodsById(action.goodsId)
  let targetData = target ? target.data : null
  let alliesData = allies.map(a => a.data)
  let enemiesData = enemies.map(e => e.data)

  if (canEffectTarget(target)) {
    useGoodsInBattle(goods, source.data, targetData, alliesData, enemiesData)
  }

  playGoodsEffects(goods, target, allies, enemies)
    .then(() => {
      source.actionEnd()
      allies.concat(enemies).forEach(a => {
        a.update()
      })

      executeNextAction()
    })
}