import { ox, OText } from 'oixi2';
import { Container, Text } from 'pixi.js'
import { AppRect, XAppRect } from './AppRect';
import { COLOR_DEEP_GOLD, COLOR_LIGHT, COLOR_GRAY_E, COLOR_DEEP, COLOR_RED, COLOR_GRAY_5, COLOR_WHITE } from '../game/constant';
import { AppContainer } from './AppContainer';
import { AppHero, XAppHero } from './AppHero';
import { AppButton, XAppButton } from './AppButton';
import { Ease, tween } from '../utils/tween';
import { back } from '../utils/router';
import { showMaskSlowly } from './AppMask';
import { getHeroName, getGoodsById, goHome } from '../game/app';
import { tempData } from '../game/dataTemp';
import { HeroExpStatus, allocExps, handleResult } from '../game/battleManager';
import { Goods } from '../model/Goods';
import { showAd } from '../native/h2n';
import { confirmText } from './AppConfirm';
import { floor, random } from '../utils/math';
import { playSound, playMusic } from '../utils/sound';

export function BattleResult(attributes: string) {
  return ox(new XBattleResult, attributes, () => [
    AppRect(360, 50, COLOR_DEEP_GOLD, '#bar'),
    AppRect(360, 210, COLOR_LIGHT, 'y=50'),
    OText('#title anchor=0.5 x=180 y=25', { fill: COLOR_WHITE, fontSize: 18 }),

    AppRect(350, 40, COLOR_GRAY_E, 'x=5 y=55'),
    OText('#gem anchor.y=0.5 x=20 y=75', { fill: COLOR_DEEP }),
    OText('#exp anchor.y=0.5 x=140 y=75', { fill: COLOR_DEEP }),
    OText('#goods anchor.y=0.5 x=260 y=75', { fill: COLOR_DEEP, fontWeight: 'bold' }),

    AppContainer('x=5 y=100', { width: 180, height: 45, column: 2 }, [
      HeroItem('#items'),
      HeroItem('#items'),
      HeroItem('#items'),
      HeroItem('#items')
    ]),

    AppButton('#btnAd @pointertap=onReward x=90 y=225', 'btn7.png', '', 14, COLOR_WHITE),
    AppButton('#btnClose @pointertap=onClose x=270 y=225', 'btn8.png', '', 14, COLOR_LIGHT),
  ])
}

export class XBattleResult extends Container {
  private bar: XAppRect = null
  private title: Text = null
  private gem: Text = null
  private exp: Text = null
  private goods: Text = null
  private btnAd: XAppButton = null
  private btnClose: XAppButton = null
  private items: XHeroItem[] = []

  private isWin: boolean
  private rewardGem: number
  private rewardExp: number
  private rewardGoods: Goods
  private resultData: HeroExpStatus[]

  /**双倍经验-exp2 复活-reborn */
  private adType: 'reward2' | 'reborn'

  onReward() {
    showAd(this.adType)
  }

  onClose() {
    playSound('tap_3')
    if (this.isWin) {
      handleResult(this.resultData, this.rewardGem, this.rewardGoods)
      showMaskSlowly(() => {
        this.visible = false
        back()
      })

    } else {
      confirmText('将会从最近的记录点重新开始\n是否确定？', () => {
        tempData.battleBossDot = null
        goHome()
      })
    }
  }

  show(isWin: boolean) {
    playMusic(null)

    this.isWin = isWin
    this.btnAd.visible = true
    this.btnClose.x = 270
    this.goods.visible = false
    this.rewardGem = 0
    this.rewardExp = 0
    this.rewardGoods = null

    if (isWin) {
      playSound('battle_win')

      this.bar.tint = COLOR_DEEP_GOLD
      this.title.text = '战斗胜利'
      tempData.battleOgres.forEach(o => {
        this.rewardGem += o.gem_16
        this.rewardExp += o.exp_16
        if (o.goods_16 && !this.rewardGoods) {
          //BOSS必定可得物品，小怪只有20%机率获得
          if (tempData.battleBossDot || random() < 0.2) {
            this.rewardGoods = getGoodsById(o.goods_16)
          }
        }
      })

      this.gem.text = '灵石 + ' + this.rewardGem
      this.exp.text = '经验 + ' + this.rewardExp

      if (this.rewardGoods) {
        this.goods.text = this.rewardGoods.name_s + ' + 1'
        this.goods.visible = true
      }
      this.adType = 'reward2'
      this.btnAd.label = '获取双倍奖励'
      this.btnClose.label = '关闭'

    } else {
      playSound('battle_fail')

      this.bar.tint = COLOR_GRAY_5
      this.title.text = '全员阵亡'
      this.gem.text = '灵石 + 0'
      this.exp.text = '经验 + 0'
      this.adType = 'reborn'
      this.btnAd.label = '复活全体成员'
      this.btnClose.label = '返回首页'
    }

    this.resultData = allocExps(this.rewardExp)
    this.updateHeros(this.resultData)

    tween(this.position).to({ y: 50 }, 300, Ease.backOut)
  }

  updateHeros(datas: HeroExpStatus[]) {
    this.items.forEach((m, i) => {
      let data = datas[i]
      if (data) {
        m.update(data)
        m.visible = true

      } else {
        m.visible = false
      }
    })
  }

  setDoubleReward() {
    this.rewardGem *= 2
    this.rewardExp *= 2
    this.gem.text = '灵石 + ' + this.rewardGem
    this.exp.text = '经验 + ' + this.rewardExp
    this.resultData = allocExps(this.rewardExp)
    this.updateHeros(this.resultData)
    this.btnAd.visible = false
    this.btnClose.x = 180
  }

}



/**英雄信息项 */
function HeroItem(attributes: string) {
  return ox(new XHeroItem, attributes, () => [
    AppRect(170, 40, COLOR_GRAY_E),
    AppHero('#display skin.direct=4 x=4 y=4'),
    OText('#hName x=40 y=4', { fill: COLOR_DEEP, fontSize: 12 }),
    OText('#hExp x=40 y=20', { fill: COLOR_DEEP, fontSize: 12 }),
    OText('#status anchor=0.5 x=145 y=20', { fill: COLOR_RED })
  ])
}

class XHeroItem extends Container {
  private display: XAppHero = null
  private hName: Text = null
  private hExp: Text = null
  private status: Text = null

  update(data: HeroExpStatus) {
    this.hName.text = getHeroName(data.hero)
    this.hExp.text = `经验+${data.exp}(${floor(data.rate * 100)}%)`
    this.display.update(data.hero)

    if (data.status) {
      if (data.status == 1) {
        this.status.text = '升级'
        this.status.style.fill = COLOR_RED

      } else if (data.status == 2) {
        this.status.text = '阵亡'
        this.status.style.fill = COLOR_GRAY_5
      }
      this.status.visible = true

    } else {
      this.status.visible = false
    }
  }
}