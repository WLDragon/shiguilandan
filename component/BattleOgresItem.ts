import { OSprite, OText, ox } from 'oixi2'
import { Container, Sprite, Text } from 'pixi.js';
import Ogre from '../model/Ogre';
import { COLOR_GREEN, COLOR_BLUE, COLOR_WHITE, COLOR_LIGHT_YELLOW } from '../game/constant';
import { AppStrip, XAppStrip } from './AppStrip';
import { min } from '../utils/math';
import { ITween, tween } from '../utils/tween';
import { AppNumber, XAppNumber } from './AppNumber';

export function BattleOgresItem(ogre: Ogre) {

  return ox(new XBattleOgresItem, null, () => [
    OSprite('#tri visible=0 anchor.x=0.5 x=16 y=-36', 'ico_tri.png'),
    OText('#oName anchor.x=0.5 x=16 y=-14', { fill: COLOR_WHITE, fontSize: 12, stroke: 0, strokeThickness: 1 }),
    AppStrip('#hpBar y=5', 32, 5, COLOR_GREEN),
    AppStrip('#mpBar y=9', 32, 5, COLOR_BLUE),

    OSprite('x=8 y=47', 'shadow.png'),
    OSprite('#skin y=18', ogre.skin_s + '.png'),
    AppNumber('#num visible=0'),

    //临时状态效果
    OSprite('#efcFreeze anchor=0.5 visible=0', 'e004.png')
  ]).build(ogre)
}

export class XBattleOgresItem extends Container {
  private oName: Text = null
  private hpBar: XAppStrip = null
  private mpBar: XAppStrip = null
  private num: XAppNumber = null
  private tri: Sprite = null
  private skin: Sprite = null
  private efcFreeze: Sprite = null

  private timeOutId: any
  private tweenObject: ITween

  public data: Ogre
  public attack: number
  public defend: number
  public isHero = false

  build(ogre: Ogre) {
    this.oName.text = ogre.name_s
    this.data = ogre
    this.attack = ogre.attack_32
    this.defend = ogre.defend_32
    this.update()
    return this
  }

  glint(beginTime: number, watiTime: number) {
    this.interactive = true
    this.tri.visible = true
    this.tri.alpha = 0
    this.timeOutId = setTimeout(() => {
      this.tweenObject = tween(this.tri, 0).to({ alpha: 1 }).wait(600).to({ alpha: 0 }).wait(watiTime)
    }, beginTime)
  }

  stopGlint() {
    this.interactive = false
    this.tri.visible = false
    clearTimeout(this.timeOutId)
    if (this.tweenObject) {
      this.tweenObject.clear()
      this.tweenObject = null
    }
  }

  ready(callback: Function) {
    tween(this, 2)
      .to({ alpha: 0 }, 0)
      .wait(50)
      .to({ alpha: 1 }, 0)
      .wait(50)
      .onAllComplete(callback)
  }

  actionEnd() {
    //怪物不需要复位，但是要和人物的接口一样
  }

  /**播放受伤动画 */
  hurt(value: number) {
    return new Promise<void>(resolve => {
      this.num.setValue(value)
      let x = (this.width - 8 - this.num.width) / 2
      let y = (this.height - this.num.height) / 2
      this.num.position.set(x, y)
      let targetY = y - (this.height / 2 + 20)
      this.num.visible = true

      tween(this.num.position).to({ y: targetY }, 200).wait(300).onComplete(() => {
        this.num.visible = false
        resolve()
      })
    })
  }

  update() {
    if (this.data.hp_32 == 0) {
      this.destroy()

    } else {
      this.hpBar.setValue(this.data.hp_32 / this.data.maxHp_32)
      this.mpBar.setValue(this.data.mp_16 / this.data.maxMp_16)

      this.efcFreeze.visible = false
      if (this.data.status_a.includes(4)) {
        let w = this.skin.width
        let h = this.skin.height
        let m = min(w, h)
        let r = m / 32
        this.efcFreeze.scale.set(r)
        this.efcFreeze.position.set(w / 2, h / 2 + 18)
        this.efcFreeze.visible = true
      }

      if (this.data.status_a.includes(101)) {
        this.skin.tint = COLOR_LIGHT_YELLOW
      } else {
        this.skin.tint = COLOR_WHITE
      }
    }
  }
}