import { OContainer, OSprite, OText, ox } from 'oixi2'
import { Container, Text } from 'pixi.js'
import { AppBox } from './AppBox';
import { COLOR_LIGHT, COLOR_DEEP } from '../game/constant';
import { layout } from '../utils/layout';
import { AppButton, XAppButton } from './AppButton';
import { Goods } from '../model/Goods';
import { GoodsMagic } from '../model/GoodsMagic';
import { getRootName } from '../game/app';
import { playSound } from '../utils/sound';

export function AppDesc(attributes: string) {
  return ox(new XAppDesc, attributes, () => [
    AppBox(230, 150, 'interactive=1', COLOR_LIGHT, COLOR_DEEP, 0, 2),
    OSprite('@pointertap=onClose x=196 y=2', 'close1.png'),
    OText('#title x=6 y=8', { fill: COLOR_DEEP, fontSize: 18 }),
    OText('#desc x=12 y=36', { fill: COLOR_DEEP, wordWrapWidth: 206, wordWrap: true, breakWords: true }),
    layout(OContainer([
      AppButton('#btn1 x=30 y=16 @pointertap=onTap1', 'btn1.png', '', 14, COLOR_LIGHT),
      AppButton('#btn2 x=92 y=16 @pointertap=onTap2', 'btn1.png', '', 14, COLOR_LIGHT)
    ]), 230, 150).right(6).bottom(6).target
  ])
}

export class XAppDesc extends Container {
  title: Text = null
  desc: Text = null
  btn1: XAppButton = null
  btn2: XAppButton = null

  /**1-丢弃 2-遗忘法术 */
  private useType1: number
  /**1-使用物品法术 2-装备 3-领悟法术 */
  private useType2: number
  goods: Goods

  onClose() {
    playSound('tap_3')
    this.visible = false
  }

  onTap1() {
    playSound('tap_3')
    this.emit('kill', this.useType1, this.goods)
    this.visible = false
  }

  onTap2() {
    playSound('tap_1')
    this.emit('ok', this.useType2, this.goods)
    this.visible = false
  }

  /**
   * 显示物品描述
   * @param goods 要显示资料的物品
   * @param scn 当前使用场景 1-地图背包 2-人物法术 3-战斗
   */
  show(goods: Goods, scn: number) {
    this.goods = goods
    let gName = `【${goods.name_s}】`
    if (goods.type_8 == 4) {
      gName += getRootName((goods as GoodsMagic).root_8)
    }
    this.title.text = gName
    this.desc.text = goods.desc_s

    if (scn == 1) {
      this.showAsScn1(goods)

    } else if (scn == 2) {
      this.showAsScn2(goods as GoodsMagic)

    } else if (scn == 3) {
      this.showAsScn3(goods)
    }

    this.visible = true
  }

  /**地图背包 */
  private showAsScn1(goods: Goods) {
    this.btn1.visible = true
    this.btn1.label = '丢弃'
    this.btn2.enable = true
    this.useType1 = 1

    if (goods.type_8 == 1) {
      this.btn2.label = '使用'
      this.useType2 = 1

    } else if (goods.type_8 == 2) {
      this.btn2.label = '装备'
      this.useType2 = 2

    } else if (goods.type_8 == 3) {
      this.btn2.label = '使用'
      this.useType2 = 1
      if (goods.env_8 == 2) {
        this.btn2.enable = false
      }

    } else if (goods.type_8 == 4) {
      this.btn1.visible = false
      this.btn2.label = '领悟'
      this.useType2 = 3

    } else if (goods.type_8 == 5) {
      this.btn1.visible = false
      this.btn2.label = '使用'
      this.useType2 = 1
    }
  }

  /**人物法术 */
  private showAsScn2(goods: GoodsMagic) {
    this.btn1.visible = true
    this.btn1.label = '遗忘'
    this.useType1 = 2

    this.btn2.enable = (goods.env_8 != 2)
    this.btn2.label = '施展'
    this.useType2 = 1
  }

  /**战斗 */
  private showAsScn3(goods: Goods) {
    this.btn1.visible = false

    this.btn2.label = goods.type_8 == 4 ? '施展' : '使用'
    this.btn2.enable = (goods.env_8 != 1)
    this.useType2 = 1
  }
}