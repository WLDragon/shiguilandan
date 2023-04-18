import { OSprite, OText, ox } from 'oixi2'
import { Container, Text, Sprite } from 'pixi.js';
import { COLOR_WHITE, UP, DOWN, LEFT } from '../game/constant';
import { $t } from '../utils/i18n';
import { layout } from '../utils/layout';
import { floor } from '../utils/math';
import { AppBox, XAppBox } from './AppBox';
import { playSound } from '../utils/sound';

export function WorldDialog(attributes: string) {
  return ox(new XWorldDialog, attributes, () => [
    AppBox(0, 0, '#bg', COLOR_WHITE, 0, 0, 2),
    OSprite('#triangle pivot.x=10', 'dialog.png'),
    OText('#txt', { fill: 0, wordWrapWidth: 300, wordWrap: true, breakWords: true })
  ])
}

export class XWorldDialog extends Container {
  bg: XAppBox = null
  triangle: Sprite = null
  txt: Text = null

  say(key: number, direct: number) {
    playSound('dialog')

    let message = $t('npc.' + key)
    if (this.txt.text != message) {
      this.txt.text = message
    }

    let w = this.txt.width + 20
    let h = this.txt.height + 20

    this.bg.resize(w, h)

    this.triangle.x = floor(w / 2)
    this.triangle.y = h - 2

    layout(this.txt, w, h).center()
    if (direct == UP) {
      layout(this).centerX().top(180 - 58 - h)

    } else if (direct == DOWN) {
      layout(this).centerX().top(180 + 6 - h)

    } else if (direct == LEFT) {
      layout(this).centerX(-32).top(180 - 26 - h)

    } else {
      layout(this).centerX(32).top(180 - 26 - h)
    }

    this.visible = true
  }
}