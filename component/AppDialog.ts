import { OText, ox } from 'oixi2';
import { Container, Text } from 'pixi.js';
import { $t } from '../utils/i18n';
import { AppButton, XAppButton } from './AppButton';
import { WIDTH, COLOR_DEEP, COLOR_LIGHT } from '../game/constant';
import { AppRect } from './AppRect';
import { layout } from '../utils/layout';

export function AppDialog(attributes: string, btn1Label: string, btn2Label?: string) {
  let template = [
    AppRect(WIDTH, 150, COLOR_DEEP),
    OText('#text x=10 y=10', { fill: COLOR_LIGHT, fontSize: 16, wordWrapWidth: WIDTH - 20, wordWrap: true, breakWords: true, leading: 4 }),
    layout(
      AppButton('#btns @pointertap=onTap1', 'btn3.png', btn1Label), WIDTH, 150
    ).bottom(10).right(10).target
  ]
  if (btn2Label) {
    template.push(layout(
      AppButton('#btns @pointertap=onTap2', 'btn3.png', btn2Label), WIDTH, 150
    ).bottom(10).right(120).target)
  }
  return ox(new XAppDialog, attributes, () => template)
}

export class XAppDialog extends Container {
  private text: Text = null
  private btns: XAppButton[] = []

  say(key: string, ...rest: string[]) {
    this.text.text = $t(key, ...rest)
  }

  sayText(text: string) {
    this.text.text = text
  }

  onTap1() {
    this.emit('tap1')
  }

  onTap2() {
    this.emit('tap2')
  }

  visibleButtons(visible: boolean) {
    this.btns.forEach(b => b.visible = visible)
  }

  visibleButtonByIndex(index: number, visible: boolean) {
    this.btns[index].visible = visible
  }
}