import { ox, OContainer, OSprite } from 'oixi2';
import { Container, InteractionEvent, Sprite, Texture } from 'pixi.js';
import { back, IRouter } from '../utils/router'
import { BattleMenu, XBattleMenu } from './BattleMenu';
import { EVENT_BATTLE_CHOOSE_ACTION, EVENT_BATTLE_ACTION, EVENT_STOP_HERO_PLAY, EVENT_BATTLE_RESULT, EVENT_AD_2REWARD, EVENT_AD_REBORN_BATTLE, EVENT_BATTLE_NEW_TURN, WIDTH, HEIGHT } from '../game/constant';
import { hideMaskQuickly, showMaskSlowly } from './AppMask';
import Hero from '../model/Hero';
import { newBattleTurn, createUserAction, reborn, checkBattleOver } from '../game/battleManager';
import { on, off } from '../utils/emitter';
import { Action } from '../model/notype/Action';
import { BattleHeros, XBattleHeros } from './BattleHeros';
import { BattleOgres, XBattleOgres } from './BattleOgres';
import { AppRect } from './AppRect';
import { XBattleOgresItem } from './BattleOgresItem';
import { XBattleHerosItem } from './BattleHerosItem';
import { handleBattleAction } from '../game/battleActionManager';
import { BattleObjectItem, initEffectContainer } from '../game/battleEffects';
import { layout } from '../utils/layout';
import { BattleResult, XBattleResult } from './BattleResult';
import { restoreOgreMp, testBattleObjectStatus } from '../game/buffManager';
import { floor } from '../utils/math';
import { DotBoss } from '../model/notype/DotBoss';
import { DotNest } from '../model/notype/DotNest';
import { playMusic, playSound } from '../utils/sound';

export default function () {
  let cx = floor(WIDTH / 2)
  let cy = floor(HEIGHT / 2)

  return ox(new A, null, () => [
    OSprite(`#bg scale=4 anchor=0.5 x=${cx} y=${cy}`),
    layout(
      OContainer([
        AppRect(512, 128, 0, 'alpha=0'),//用于居中占位
        BattleOgres('#ogres @pointertap=onOgreSelected'),
        BattleHeros('#heros @pointertap=onHeroSelected')
      ])
    ).centerX().bottom(82).target,

    BattleMenu('#menu @ogre=onSelectOgre @user=onSelectHero @cancel=onActionCancel'),

    OContainer('#effectBox'),

    layout(BattleResult('#result visible=0')).centerX().target
  ])
}

class A extends Container implements IRouter {
  bg: Sprite = null
  ogres: XBattleOgres = null
  heros: XBattleHeros = null
  menu: XBattleMenu = null
  effectBox: Container = null
  result: XBattleResult = null


  onSelectOgre() {
    this.ogres.toSelectMode(true)
  }

  onSelectHero() {
    this.heros.toSelectMode(true)
  }

  onActionCancel() {
    this.heros.toSelectMode(false)
    this.ogres.toSelectMode(false)
  }

  onOgreSelected(e: InteractionEvent) {
    let o = e.target
    if (o instanceof XBattleOgresItem) {
      playSound('tap_1')
      this.ogres.toSelectMode(false)
      createUserAction(o.data.id_16)
    }
  }

  onHeroSelected(e: InteractionEvent) {
    let h = e.target
    if (h instanceof XBattleHerosItem) {
      playSound('tap_2')
      this.heros.toSelectMode(false)
      createUserAction(h.data.id_16)
    }
  }

  onNewTurn = () => {
    let arr: BattleObjectItem[] = this.heros.heroItems
    restoreOgreMp(this.ogres.orgeItems)
    let isDelay = testBattleObjectStatus(arr.concat(this.ogres.orgeItems))

    if (isDelay) {
      if (!checkBattleOver()) {
        setTimeout(newBattleTurn, 500)
      }
    } else {
      newBattleTurn()
    }
  }

  onBattleChooseAction = (hero: Hero) => {
    this.menu.showByHero(hero)
    this.heros.active(hero)
  }

  onBattleActon = (action: Action) => {
    this.menu.closeActionBox()

    let source: BattleObjectItem
    let target: BattleObjectItem
    let allies: BattleObjectItem[]
    let enemies: BattleObjectItem[]

    if (action.isUser) {
      allies = this.heros.heroItems
      enemies = this.ogres.orgeItems
    } else {
      allies = this.ogres.orgeItems
      enemies = this.heros.heroItems
    }

    source = allies.find(a => a.data.id_16 == action.source)

    //群攻或逃跑符是没有目标的
    if (action.target > 0) {
      target = (action.target > 100) ? this.ogres.getItemById(action.target) : this.heros.getItemById(action.target)
    }

    handleBattleAction(action, source, target, allies, enemies)
  }

  onStopHeroPlay = () => {
    this.heros.stop()
  }

  onShowResult = (isWin: boolean) => {
    this.result.y = -260
    this.result.visible = true
    this.result.show(isWin)
  }

  on2Reward = () => {
    this.result.setDoubleReward()
  }

  onReborn = () => {
    reborn()
    showMaskSlowly(() => {
      this.result.visible = false
      back()
    })
  }

  actived(dot: DotBoss | DotNest): void {
    playMusic('bg_battle', 0.5)

    this.bg.texture = Texture.from(`bg${dot.bg}.png`)

    this.heros.init()
    this.menu.init()

    this.ogres.init({ ogres: dot.ogres, boss: !!(dot as DotBoss).skin })

    hideMaskQuickly()

    this.onNewTurn()
  }

  created(): void {
    initEffectContainer(this.effectBox)

    on(EVENT_BATTLE_CHOOSE_ACTION, this.onBattleChooseAction)
    on(EVENT_BATTLE_ACTION, this.onBattleActon)
    on(EVENT_STOP_HERO_PLAY, this.onStopHeroPlay)
    on(EVENT_BATTLE_RESULT, this.onShowResult)
    on(EVENT_AD_2REWARD, this.on2Reward)
    on(EVENT_AD_REBORN_BATTLE, this.onReborn)
    on(EVENT_BATTLE_NEW_TURN, this.onNewTurn)
  }

  beforeDestroy(): void {
    off(EVENT_BATTLE_CHOOSE_ACTION)
    off(EVENT_BATTLE_ACTION)
    off(EVENT_STOP_HERO_PLAY)
    off(EVENT_BATTLE_RESULT)
    off(EVENT_AD_2REWARD)
    off(EVENT_AD_REBORN_BATTLE)
    off(EVENT_BATTLE_NEW_TURN)
  }
}
