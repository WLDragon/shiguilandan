import { OText, ox, OContainer, OSprite } from 'oixi2';
import { Container, Text } from 'pixi.js'
import { COLOR_LIGHT, COLOR_DEEP, COLOR_YELLOW } from '../game/constant';
import { AppBag, XAppBag } from './AppBag';
import { AppButton, XAppButton } from './AppButton';
import { AppSlider, XAppSlider } from './AppSlider';
import { Ease, tween } from '../utils/tween';
import { $t } from '../utils/i18n';
import { DotShop } from '../model/notype/DotShop';
import { Goods } from '../model/Goods';
import { getGoodsById } from '../game/app';
import { AppBox } from './AppBox';
import { AppGoodsList, XAppGoodsList } from './AppGoodsList';
import { warnText } from './AppTips';
import { buy, sale } from '../game/dataManager';
import { floor } from '../utils/math';
import { playSound } from '../utils/sound';

export function WorldShop(attributes: string) {
  return ox(new XWorldShop, attributes, () => [
    AppBox(266, 38, 'interactive=1'),
    OText('anchor=0.5 x=133 y=18', '商店', { fill: COLOR_LIGHT, fontSize: 16 }),

    //物品列表
    AppBox(266, 120, 'y=38 interactive=1'),
    AppGoodsList('#shop @select=onShopSelect x=9 y=46', 3, 7),

    //描述物品栏
    OContainer('y=158 interactive=1', [
      AppBox(266, 142),
      OText('#title x=7 y=10', { fill: COLOR_YELLOW, fontSize: 16 }),
      OContainer('#priceBox visible=0 y=10', [
        OSprite('y=2', 'gem.png'),
        OText('#price x=20', { fill: COLOR_YELLOW, fontSize: 16 }),
      ]),
      OText('#desc x=14 y=33', { fill: COLOR_YELLOW, fontSize: 12, wordWrapWidth: 246, wordWrap: true, breakWords: true }),
      AppSlider('#slider x=7 y=103', { min: 1, max: 99, stripWidth: 116 }),
      AppButton('#btnDeal @pointertap=onDeal x=229 y=119', 'btn5.png', $t('ui.2'), 14, COLOR_DEEP)
    ]),

    //背包
    AppBag('#bag @select=onBagSelect @tab=onBagTab x=268 y=-300'),

    //关闭按钮
    AppButton('x=-18 y=284 @pointertap=onCloseWithSound', 'close2.png')
  ])
}

export class XWorldShop extends Container {
  shop: XAppGoodsList = null

  title: Text = null
  desc: Text = null
  priceBox: Container = null
  price: Text = null
  slider: XAppSlider = null
  btnDeal: XAppButton = null

  bag: XAppBag = null

  activeGoods: Goods
  isBuyMode: boolean

  onBagTab() {
    if (!this.isBuyMode) {
      this.toSelectGoods(0)
    }
  }

  onShopSelect(goodsId: number) {
    this.isBuyMode = true
    this.toSelectGoods(goodsId)
    this.btnDeal.label = '购买'
    this.btnDeal.skin = 'btn5.png'
    this.bag.clearSelect()
  }

  onBagSelect(goodsId: number) {
    this.isBuyMode = false
    this.toSelectGoods(goodsId)
    this.btnDeal.label = '出售'
    this.btnDeal.skin = 'btn6.png'
    this.shop.clearSelect()
  }

  toSelectGoods(goodsId: number) {
    if (goodsId) {
      let goods = getGoodsById(goodsId)
      this.activeGoods = goods
      this.title.text = `【${goods.name_s}】`
      this.desc.text = goods.desc_s
      this.price.text = this.isBuyMode ? goods.price_32 : floor(goods.price_32 * 0.8)

      this.priceBox.x = this.title.x + this.title.width
      this.priceBox.visible = true

    } else {
      this.activeGoods = null
      this.title.text = ''
      this.desc.text = ''
      this.priceBox.visible = false
    }

    this.slider.setValue(1)
  }

  onDeal() {
    if (this.activeGoods) {
      if (this.isBuyMode) {
        buy(this.activeGoods, this.slider.value)
        this.bag.tabTo(0)
        this.bag.update()

      } else {
        if (this.activeGoods.price_32) {
          sale(this.activeGoods, this.slider.value)
          this.bag.update()

        } else {
          warnText(`商店不收【${this.activeGoods.name_s}】`)
        }
      }

    } else {
      warnText('请选择一个物品')
    }
  }

  open(dot: DotShop) {
    if (!this.visible) {
      let goods = dot.goods.map(gid => getGoodsById(gid))
      this.toSelectGoods(0)
      this.shop.updateByGoods(goods)
      this.shop.clearSelect()
      this.slider.setValue(1)
      this.bag.clearSelect()
      this.bag.update()

      this.visible = true
      tween(this.bag.position).to({ y: 0 }, 400, Ease.backOut)
      tween(this.position).to({ y: 30 }, 300, Ease.backOut)
    }
  }

  onCloseWithSound() {
    playSound('tap_3')
    this.onClose()
  }

  onClose() {
    if (this.visible) {
      tween(this.position).to({ y: -300 }, 200, Ease.backIn).onComplete(() => {
        this.bag.y = -300
        this.visible = false
      })
    }
  }
}