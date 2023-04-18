import { OSprite, OText, ox } from 'oixi2'
import { Container, InteractionEvent, Rectangle, Sprite, Text } from 'pixi.js';
import { COLOR_YELLOW, COLOR_DEEP, COLOR_LIGHT } from '../game/constant';
import { AppRect } from './AppRect';
import { AppContainer } from './AppContainer';
import { getTeam, getGoodsContainerByType } from '../game/database';
import { AppBox } from './AppBox';
import { AppGoodsList, XAppGoodsList } from './AppGoodsList';
import { _GoodsQuantity } from '../model/notype/_GoodsQuantity';
import { playSound } from '../utils/sound';

export function AppBag(attributes: string) {
  return ox(new XAppBag, attributes, () => [
    AppBox(234, 38, 'interactive=1'),
    OSprite('x=11 y=11', 'gem.png'),
    OText('#gem anchor.y=0.5 x=35 y=18', { fill: COLOR_YELLOW, fontSize: 16 }),

    //物品列表
    AppBox(234, 230, 'y=70 interactive=1'),
    AppGoodsList('#goodsList @select=onGoodsSelect x=11 y=79', 6, 6),

    //TabBar
    AppRect(234, 32, COLOR_DEEP, 'y=38 interactive=1'),
    AppContainer('y=38 @pointertap=onTabTap', { width: 39 }, [
      AppBagTabItem('#tabs', '常用', 0),
      AppBagTabItem('#tabs', '丹药', 1),
      AppBagTabItem('#tabs', '法宝', 2),
      AppBagTabItem('#tabs', '符箓', 3),
      AppBagTabItem('#tabs', '法术', 4),
      AppBagTabItem('#tabs', '其他', 5)
    ])

  ]).build()
}

export class XAppBag extends Container {
  gem: Text = null
  tabs: XAppBagTabItem[] = []
  goodsList: XAppGoodsList = null

  private currentTabType: number

  build() {
    this.tabTo(0)
    return this
  }

  tabTo(index: number) {
    let t = this.tabs[index]
    this.currentTabType = t.id
    this.tabs.forEach(b => b.select(t == b))
  }

  onTabTap(e: InteractionEvent) {
    let m = e.target
    if (m instanceof XAppBagTabItem) {
      playSound('tap_1')
      this.currentTabType = m.id
      this.tabs.forEach(t => t.select(t == m))

      this.clearSelect()
      this.update()

      this.emit('tab')
    }
  }

  onGoodsSelect(goodsId: number) {
    this.emit('select', goodsId)
  }

  clearSelect() {
    this.goodsList.clearSelect()
  }

  update() {
    let team = getTeam()
    this.gem.text = team.gem_32
    this.tabs[4].highlight(team.magics_a.length > 0)

    let arr = getGoodsContainerByType(this.currentTabType)
    this.goodsList.updateByQuantity(arr)
  }
}

/**Tab项 */
function AppBagTabItem(attributes: string, label: string, id: number) {
  return ox(new XAppBagTabItem(id), attributes, () => [
    OSprite('#bg visible=0', 'goodsTab.png'),
    OText('#label anchor=0.5 x=20 y=18', label, { fontSize: 12 })
  ])
}

class XAppBagTabItem extends Container {
  bg: Sprite = null
  label: Text = null
  id: number

  constructor(id: number) {
    super()
    this.id = id
    this.interactive = true
    this.hitArea = new Rectangle(0, 0, 39, 35)
  }

  select(value: boolean) {
    this.bg.visible = value
  }

  highlight(value: boolean) {
    this.label.style.fill = value ? COLOR_YELLOW : COLOR_LIGHT
  }
}
