import { OSprite, OText, ox } from 'oixi2'
import { Container, Sprite } from 'pixi.js';
import { IRouter, to, back } from '../utils/router';
import { AppRect } from './AppRect';
import { WIDTH, HEIGHT, COLOR_LIGHT, COLOR_DEEP, COLOR_DEEP_YELLOW } from '../game/constant';
import { layout } from '../utils/layout';
import { AppDialog, XAppDialog } from './AppDialog';
import { AppContainer } from './AppContainer';
import { shake } from '../utils/shake';
import { warnText } from './AppTips';
import { createFirstHero } from '../game/dataManager';
import { playSound } from '../utils/sound';

export default function () {
  return ox(new A, null, () => [
    AppRect(WIDTH, HEIGHT, COLOR_LIGHT),
    layout(
      AppContainer(null, { width: 122 }, [
        RootItem('#roots', 1, '金', '不会法术\n攻击+15%\n防御+10%\n敏捷-20%\n体力+15%'),
        RootItem('#roots', 2, '水', '控制系法术\n攻击-5%\n敏捷+5%\n法力+15%'),
        RootItem('#roots', 3, '木', '治疗系法术\n攻击-5%\n防御-5%\n敏捷+15%'),
        RootItem('#roots', 4, '火', '伤害系法术\n攻击+5%\n防御-10%\n敏捷+5%\n法力+10%'),
        RootItem('#roots', 5, '土', '逃生系法术\n攻击-10%\n防御+5%\n敏捷-5%\n体力+10%')
      ]), WIDTH, HEIGHT - 150
    ).center().target,
    layout(
      AppDialog('#dialog @tap1=onOk @tap2=onBack', '确定', '返回')
    ).bottom().target
  ])
}

class A extends Container implements IRouter {
  dialog: XAppDialog = null
  roots: XRootItem[] = []

  created(): void {
    let txt = '请选择灵根\n'
    txt += '选择的灵根越多，可以领悟到的法术越多，但吸收经验的效率越低\n'
    txt += '吸收经验效率：单灵根100%，双灵根90%，三灵根80%，四灵根70%，五灵根60%'
    this.dialog.sayText(txt)
  }

  onOk() {
    let ids = this.roots.filter(r => r.selected).map(r => r.id)
    if (ids.length) {
      playSound('tap_1')
      createFirstHero(ids)
      to('World')

    } else {
      this.roots.forEach(r => shake(r, 8))
      warnText('请至少选择一个灵根！')
    }
  }

  onBack() {
    playSound('tap_3')
    back()
  }
}



export function RootItem(attributes: string, id: number, title: string, desc: string) {
  return ox(new XRootItem, attributes, () => [
    OSprite('#bg @pointertap=onTap', 'rootBg.png'),
    OText('anchor.x=0.5 x=56 y=15', title, { fontSize: 36 }),
    OText('anchor.x=0.5 x=56 y=70', desc)
  ]).build(id)
}

export class XRootItem extends Container {
  bg: Sprite = null
  id: number
  _selected: boolean

  build(id: number) {
    this.id = id
    this.selected = false
    return this
  }

  onTap() {
    playSound('tap_2')
    this.selected = !this.selected
  }

  get selected(): boolean {
    return this._selected
  }

  set selected(value: boolean) {
    this._selected = value
    this.bg.tint = value ? COLOR_DEEP_YELLOW : COLOR_DEEP
  }
}