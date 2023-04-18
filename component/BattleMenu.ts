import { ox, OContainer, OText, OSprite } from 'oixi2';
import { Container, Sprite, Text, Texture } from 'pixi.js';
import { AppContainer } from './AppContainer';
import { AppButton, XAppButton } from './AppButton';
import { BattleMenuGoods, XBattleMenuGoods } from './BattleMenuGoods';
import { BattleMenuMagic, XBattleMenuMagic } from './BattleMenuMagic';
import { AppBox } from './AppBox';
import { cancelActionChoose, testActionLength, createUserAction, enableAutoBattle } from '../game/battleManager';
import Hero from '../model/Hero';
import { tempData } from '../game/dataTemp';
import { AppDesc, XAppDesc } from './AppDesc';
import { Ease, tween } from '../utils/tween';
import { getTeam } from '../game/database';
import { getGoodsById, getHeroName } from '../game/app';
import { Goods } from '../model/Goods';
import { AppRect } from './AppRect';
import { COLOR_DEEP, WIDTH } from '../game/constant';
import { floor } from '../utils/math';
import { playSound, toggleMusic, toggleSound } from '../utils/sound';
import { layout } from '../utils/layout';
import { saveSettings, settings } from '../game/dataSaved';

export function BattleMenu(attributes: string) {
  let bx = floor((WIDTH - 600) / 2)
  return ox(new XBattleMenu, attributes, () => [
    OContainer('#box x=' + bx, [
      //物品栏和法术
      BattleMenuMagic('#magic @select=onMagicSelect interactive=1 visible=0 x=135 y=41'),
      BattleMenuGoods('#elixir @select=onGoodsSelect interactive=1 visible=0 x=185 y=81'),
      BattleMenuGoods('#talisman @select=onGoodsSelect interactive=1 visible=0 x=279 y=81'),
      AppDesc('#desc @ok=onUseGoods visible=0 x=258 y=105'),

      //提示行动人
      OContainer('#actionBox visible=0 x=193', [
        AppRect(180, 32, COLOR_DEEP),
        OText('#actionTips anchor=0.5 x=90 y=16'),
        AppButton('#btnCancel @pointertap=onCancel x=197 y=16', 'close2.png')
      ]),

      //按钮菜单
      OContainer('x=63 y=311', [
        AppBox(474, 52),
        AppContainer('x=51 y=26', { width: 93 }, [
          AppButton('#btns @pointertap=onAttack', 'btn3.png', '攻击'),
          AppButton('#btns @pointertap=onOpenMagic', 'btn3.png', '法术'),
          AppButton('#btns @pointertap=onOpenElixir', 'btn3.png', '丹药'),
          AppButton('#btns @pointertap=onOpenTalisman', 'btn3.png', '符箓'),
          AppButton('#btns @pointertap=onAutoBattle', 'btn3.png', '托管战斗'),
        ]),
        AppButton('#btnAutoCancel x=423 y=26 visible=0 @pointertap=onCancelAuto', 'btn3.png', '取消托管')
      ])
    ]),

    //控制音量菜单
    layout(OContainer([
      OSprite('#iconMusic @pointertap=onToggleMusic', 'ico_music2.png'),
      OSprite('#iconSound x=42 @pointertap=onToggleSound', 'ico_sound2.png')
    ])).top(4).right(10).target

  ]).build()
}

export class XBattleMenu extends Container {
  box: Container = null
  magic: XBattleMenuMagic = null
  elixir: XBattleMenuGoods = null
  talisman: XBattleMenuGoods = null
  btnCancel: XAppButton = null
  btns: XAppButton[] = []
  btnAutoCancel: XAppButton = null
  desc: XAppDesc = null
  actionBox: Container = null
  actionTips: Text = null

  iconMusic: Sprite = null
  iconSound: Sprite = null

  currentHero: Hero
  /**1-行动按钮可点 2-行动按钮不可点 3-取消托管按钮可见 */
  menuType: number

  build() {
    this.updateIconMusic()
    this.updateIconSound()
    return this
  }

  /**
   * 切换按钮状态
   * @param type 1-行动按钮可点 2-行动按钮不可点 3-取消托管按钮可见
   */
  changeButtonStatus(type: number) {
    this.menuType = type
    if (type == 1) {
      this.btns.forEach(b => b.enable = true)
      this.btnAutoCancel.visible = false
      this.btnCancel.enable = true

    } else if (type == 2) {
      this.btns.forEach(b => b.enable = false)
      this.btnAutoCancel.visible = false
      this.btnCancel.enable = true

    } else {
      this.btns.forEach(b => b.enable = false)
      this.btnAutoCancel.visible = true
      this.btnCancel.enable = false
    }
  }

  onGoodsSelect(goodsId: number) {
    this.desc.show(getGoodsById(goodsId), 3)
  }

  onMagicSelect(goodsId: number) {
    this.desc.show(getGoodsById(goodsId), 3)
  }

  onUseGoods(type: number, goods: Goods) {
    this.changeButtonStatus(2)
    this.talisman.hide()
    this.elixir.hide()
    this.magic.hide()

    if (goods.type_8 == 1) {
      tempData.battleType = 3

    } else if (goods.type_8 == 3) {
      tempData.battleType = 4

    } else if (goods.type_8 == 4) {
      tempData.battleType = 2
    }

    tempData.battleGoodsId = goods.id_16

    if (goods.for_8 == 1) {
      this.emit('user')

    } else if (goods.for_8 == 2) {
      this.emit('ogre')

    } else if (goods.for_8 == 3) {
      createUserAction(0)
    }
  }

  onAttack() {
    playSound('tap_1')

    this.changeButtonStatus(2)
    this.desc.visible = false
    this.talisman.hide()
    this.elixir.hide()
    this.magic.hide()

    tempData.battleType = 1
    this.emit('ogre')
  }

  onOpenMagic() {
    playSound('tap_2')

    this.elixir.hide()
    this.talisman.hide()
    this.desc.visible = false
    this.magic.toggle(this.currentHero)
  }

  onOpenElixir() {
    playSound('tap_2')

    this.magic.hide()
    this.talisman.hide()
    this.desc.visible = false
    this.elixir.toggle(getTeam().elixirs_a)
  }

  onOpenTalisman() {
    playSound('tap_2')

    this.magic.hide()
    this.elixir.hide()
    this.desc.visible = false
    this.talisman.toggle(getTeam().talismans_a)
  }

  onCancel() {
    playSound('tap_3')

    if (this.menuType == 1) {
      if (testActionLength()) {
        this.magic.hide()
        this.elixir.hide()
        this.talisman.hide()
        this.desc.visible = false
        cancelActionChoose()
      }

    } else {
      this.changeButtonStatus(1)
      this.emit('cancel')
    }
  }

  onAutoBattle() {
    playSound('tap_1')

    this.magic.hide()
    this.elixir.hide()
    this.talisman.hide()
    this.desc.visible = false
    this.changeButtonStatus(3)

    enableAutoBattle(true)
  }

  onCancelAuto() {
    playSound('tap_3')

    enableAutoBattle(false)
    this.changeButtonStatus(2)
  }

  showByHero(hero: Hero) {
    this.actionBox.y = -40
    this.actionBox.visible = true
    this.actionTips.text = `请【${getHeroName(hero)}】行动`
    tween(this.actionBox.position).to({ y: 10 }, 300, Ease.sineOut)

    this.currentHero = hero
    this.changeButtonStatus(1)
  }

  init() {
    this.changeButtonStatus(tempData.battleAutoAction ? 3 : 2)
  }

  closeActionBox() {
    this.actionBox.visible = false
  }

  onToggleMusic() {
    toggleMusic(!settings.music).then(() => {
      settings.music = !settings.music
      saveSettings()
      playSound('tap_1')
      this.updateIconMusic()
    })
  }

  onToggleSound() {
    toggleSound(!settings.sound).then(() => {
      settings.sound = !settings.sound
      saveSettings()
      playSound('tap_1')
      this.updateIconSound()
    })
  }

  updateIconMusic() {
    this.iconMusic.texture = Texture.from(settings.music ? 'ico_music1.png' : 'ico_music2.png')
  }

  updateIconSound() {
    this.iconSound.texture = Texture.from(settings.sound ? 'ico_sound1.png' : 'ico_sound2.png')
  }
}