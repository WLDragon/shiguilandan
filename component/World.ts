import { OContainer, OSprite, ox } from 'oixi2'
import { Container, Sprite } from 'pixi.js'
import { IRouter } from '../utils/router'
import { WorldScene, XWorldScene } from './WorldScene';
import { WorldRocker, XWorldRocker } from './WorldRocker';
import { WIDTH, EVENT_SCENE, EVENT_DIALOG, EVENT_REMOVE_DOT, EVENT_SHOP, EVENT_INQUIRE, EVENT_UPDATE_LEFT_TOP, EVENT_SCENE_REFRESH, EVENT_OPEN_ALL_DIE_PANEL, EVENT_AD_REBORN_WORLD, EVENT_STEALTH, EVENT_FLASH } from '../game/constant';
import { WorldLeftTop, XWorldLeftTop } from './WorldLeftTop';
import { WorldInfo, XWorldInfo } from './WorldInfo';
import { WorldShop, XWorldShop } from './WorldShop';
import { floor } from '../utils/math';
import { off, on } from '../utils/emitter';
import { getCommon } from '../game/database';
import { WorldMenu } from './WorldMenu';
import { layout } from '../utils/layout';
import { WorldDialog, XWorldDialog } from './WorldDialog';
import { Dot } from '../model/notype/Dot';
import { DotNpc } from '../model/notype/DotNpc';
import { DotShop } from '../model/notype/DotShop';
import { tempData } from '../game/dataTemp';
import { hideMaskQuickly } from './AppMask';
import { WorldInquire, XWorldInquire } from './WorldInquire';
import { WorldAllHeroDie, XWorldAllHeroDie } from './WorldAllHeroDie';
import { reborn } from '../game/battleManager';
import { WorldHero, XWorldHero } from './WorldHero';
import { getSceneData } from '../game/sceneConfig';
import { DotBoss } from '../model/notype/DotBoss';
import { playMusic } from '../utils/sound';
import { WorldKeyboard } from './WorldKeyboard';
import { settings } from '../game/dataSaved';

export default function () {
  let heroX = floor(WIDTH / 2 - 16)
  let shopX = floor((WIDTH - 498) / 2)

  return ox(new A, null, () => [
    WorldScene('#scene @change=onChangeStatus'),
    WorldHero('#hero y=164 x=' + heroX), //场景和英雄形象的显示层次会交换

    layout(OSprite('#dark visible=0 scale=5', 'dark.png')).centerX().target,

    OContainer('#keyboard', [
      layout(WorldKeyboard('@direct=onDirect @end=onEnd')).left(70).bottom(60).target,
      layout(WorldKeyboard('@direct=onDirect @end=onEnd')).right(70).bottom(60).target,
    ]),
    WorldRocker('#rocker @direct=onDirect @end=onEnd'),
    WorldLeftTop('#leftTop @hit=onHeroTap x=4 y=4'),
    WorldDialog('#dialog visible=0'),

    layout(WorldMenu('@rocker=onChangeRocker')).top(4).right(10).target,

    WorldInfo('#info visible=0 x=-350'),
    WorldShop('#shop visible=0 y=-300 x=' + shopX),
    layout(WorldInquire('#inquire visible=0 y=-180')).centerX().target,

    WorldAllHeroDie('#diePanel visible=0')
  ])
}

class A extends Container implements IRouter {
  scene: XWorldScene = null
  dark: Sprite = null
  keyboard: Container = null
  rocker: XWorldRocker = null
  dialog: XWorldDialog = null
  hero: XWorldHero = null
  info: XWorldInfo = null
  shop: XWorldShop = null
  inquire: XWorldInquire = null
  leftTop: XWorldLeftTop = null
  diePanel: XWorldAllHeroDie = null

  direct = -1

  onChangeRocker() {
    if (settings.rocker) {
      this.keyboard.visible = false
      this.rocker.active(true)

    } else {
      this.keyboard.visible = true
      this.rocker.active(false)
    }
  }

  onHeroTap(index: number) {
    this.info.open(index)
    this.shop.onClose()
    this.inquire.onClose()
  }

  onDirect(direct: number) {
    if (tempData.isStopMove) {
      return
    }

    this.dialog.visible = false
    this.direct = direct
    this.scene.move(direct)
    this.hero.setDirect(direct)

    this.info.onClose()
    this.shop.onClose()
    this.inquire.onClose()
  }

  onEnd() {
    this.scene.stop()
  }

  onChangeScene = (sceneName: string, sx: number, sy: number) => {
    this.info.onClose()
    let sceneData = getSceneData(sceneName)
    tempData.mapType = sceneData.type
    this.dark.visible = sceneData.type == 4
    this.scene.initScene(sceneData, sx, sy)
    this.scene.locate(sx, sy)

    playMusic('bg_' + tempData.mapType, (tempData.mapType == 1 || tempData.mapType == 4) ? 0.8 : 1)
  }

  onSceneRefresh = () => {
    let c = getCommon()
    this.scene.locate(c.sceneX_16, c.sceneY_16)
    this.dialog.visible = false
    this.info.onClose()
  }

  onDialog = (dot: DotNpc | DotBoss) => {
    this.dialog.say(dot.message, this.direct)
    this.scene.faceRole(dot, this.direct)
  }

  onChangeStatus() {
    let c = getCommon()
    this.setChildIndex(this.hero, c.isCover_8 ? 0 : 1)
    this.hero.setSkin(['h001', 'h002', 'h003'][c.skinStatus_8 - 1])
  }

  onRemoveDot = (dot: Dot) => {
    this.scene.removeSceneDot(dot)
  }

  onOpenShop = (dot: DotShop) => {
    this.shop.open(dot)
  }

  onOpenInquire = (dot: Dot) => {
    this.info.onClose()
    this.dialog.visible = false
    this.inquire.open(dot)
    this.scene.faceRole(dot, this.direct)
  }

  onUpdateLeftTop = () => {
    this.leftTop.update()
  }

  onAllHeroDie = () => {
    this.diePanel.open()
  }

  onReborn = (heroId: number) => {
    reborn(heroId)
    this.onUpdateLeftTop()
    tempData.isStopMove = false
    this.diePanel.visible = false
  }

  onStealth = () => {
    this.info.onClose()
    this.hero.stealth()
  }

  onFlash = (param: { t: number, tx: number, ty: number }) => {
    this.info.onClose()
    this.scene.flashMagic(param)
  }

  actived(param?: any): void {
    let c = getCommon()
    this.onChangeScene(c.scene_s, c.sceneX_16, c.sceneY_16)
    this.hero.setDirect(c.direct_8)
    this.hero.setActive(true)
    this.hero.appear()

    this.onChangeStatus()
    this.onChangeRocker()

    this.leftTop.update()
    this.rocker.listenKeyEvents()
  }

  reactived(lastRoute?: string): void {
    if (lastRoute == 'Battle') {
      playMusic('bg_' + tempData.mapType, (tempData.mapType == 1 || tempData.mapType == 4) ? 0.8 : 1)

      this.hero.setActive(true)
      this.onSceneRefresh()
      this.onUpdateLeftTop()
      this.rocker.listenKeyEvents()
      tempData.isStopMove = false
      hideMaskQuickly()

      if (tempData.battleBossDot) {
        if (tempData.battleBossDot.ogres.length == 0 && tempData.battleBossDot.message) {
          this.onDialog(tempData.battleBossDot)
        }
        tempData.battleBossDot = null
      }
    }
  }

  deactived(): void {
    this.hero.setActive(false)
    this.rocker.onTouchEnd()
    this.rocker.removeKeyEvents()
  }

  created(): void {
    on(EVENT_SCENE, this.onChangeScene)
    on(EVENT_SCENE_REFRESH, this.onSceneRefresh)
    on(EVENT_DIALOG, this.onDialog)
    on(EVENT_REMOVE_DOT, this.onRemoveDot)
    on(EVENT_SHOP, this.onOpenShop)
    on(EVENT_INQUIRE, this.onOpenInquire)
    on(EVENT_UPDATE_LEFT_TOP, this.onUpdateLeftTop)
    on(EVENT_OPEN_ALL_DIE_PANEL, this.onAllHeroDie)
    on(EVENT_AD_REBORN_WORLD, this.onReborn)
    on(EVENT_STEALTH, this.onStealth)
    on(EVENT_FLASH, this.onFlash)
  }

  beforeDestroy(): void {
    off(EVENT_SCENE)
    off(EVENT_SCENE_REFRESH)
    off(EVENT_DIALOG)
    off(EVENT_REMOVE_DOT)
    off(EVENT_SHOP)
    off(EVENT_INQUIRE)
    off(EVENT_UPDATE_LEFT_TOP)
    off(EVENT_OPEN_ALL_DIE_PANEL)
    off(EVENT_AD_REBORN_WORLD)
    off(EVENT_STEALTH)
    off(EVENT_FLASH)

    this.rocker.removeKeyEvents()
    this.scene.release()
  }
}