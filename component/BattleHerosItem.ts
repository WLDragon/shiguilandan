import { OSprite, ox, OText } from 'oixi2';
import { Container, Sprite, Rectangle, Text } from 'pixi.js';
import { COLOR_BLUE, COLOR_GREEN, COLOR_WHITE, RIGHT } from '../game/constant';
import Hero from '../model/Hero';
import { AppStrip, XAppStrip } from './AppStrip';
import { AppHero, XAppHero } from './AppHero';
import { ITween, tween } from '../utils/tween';
import { AppNumber, XAppNumber } from './AppNumber';
import { getHeroName } from '../game/app';

export function BattleHerosItem(hero: Hero) {
  return ox(new XBattleHerosItem, null, () => [
    OSprite('#tri visible=0 anchor.x=0.5 x=16 y=-36', 'ico_tri.png'),
    OText('#hName anchor.x=0.5 x=16 y=-14', { fill: COLOR_WHITE, fontSize: 12, stroke: 0, strokeThickness: 1 }),
    AppStrip('#hpBar y=5', 32, 5, COLOR_GREEN),
    AppStrip('#mpBar y=9', 32, 5, COLOR_BLUE),

    OSprite('x=8 y=47', 'shadow.png'),
    AppHero('#display y=18', hero.skin_s),
    AppNumber('#num visible=0'),

    //临时状态效果
    OSprite('#efcFreeze y=18 visible=0', 'e004.png')
  ]).build(hero)
}

export class XBattleHerosItem extends Container {
  private hName: Text = null
  private hpBar: XAppStrip = null
  private mpBar: XAppStrip = null
  private num: XAppNumber = null
  private tri: Sprite = null
  private efcFreeze: Sprite = null

  public display: XAppHero = null

  private timeOutId: any
  private tweenObject: ITween
  private ox: number

  public data: Hero
  public attack: number
  public defend: number
  public isHero = true

  build(data: Hero) {
    this.hitArea = new Rectangle(0, 0, 32, 50)
    this.display.skin.direct = RIGHT
    this.hName.text = getHeroName(data)

    this.data = data
    this.attack = data.attack_32 + data.attackEx_32
    this.defend = data.defend_32 + data.defendEx_32
    this.update()
    return this
  }

  fixPosition(x: number, y: number) {
    this.ox = x
    this.position.set(x, y)
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
    tween(this.position).to({ x: this.ox + 8 }, 150).onComplete(callback)
  }

  actionEnd() {
    tween(this.position).to({ x: this.ox }, 100)
  }

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
    this.hpBar.setValue(this.data.hp_32 / this.data.maxHp_32)
    this.mpBar.setValue(this.data.mp_16 / this.data.maxMp_16)
    this.display.update(this.data)

    this.efcFreeze.visible = false
    if (this.data.status_a.includes(4)) {
      this.efcFreeze.visible = true
    }
  }
}