import { ox, OText } from 'oixi2';
import { Container, Text } from 'pixi.js'
import { AppBox } from './AppBox';
import { AppButton } from './AppButton';
import { DotHotel } from '../model/notype/DotHotel';
import { Ease, tween } from '../utils/tween'
import { sleepInHotel, addNewPartner } from '../game/dataManager';
import { Dot } from '../model/notype/Dot';
import { DotHero } from '../model/notype/DotHero';
import { $t } from '../utils/i18n';
import { playSound } from '../utils/sound';

export function WorldInquire(attributes: string) {
  return ox(new XWorldInquire, attributes, () => [
    AppBox(240, 180, 'interactive=1'),
    OText('#message anchor.x=0.5 x=120 y=20', { wordWrap: true, wordWrapWidth: 200, breakWords: true, align: 'center', leading: 4 }),
    AppButton('x=80 y=150 @pointertap=onClose', 'btn6.png', '取消'),
    AppButton('x=160 y=150 @pointertap=onOk', 'btn5.png', '确定')
  ])
}

export class XWorldInquire extends Container {
  message: Text = null
  dot: Dot

  onClose() {
    if (this.visible) {
      playSound('tap_3')
      tween(this.position).to({ y: -180 }, 200, Ease.backIn).onComplete(() => {
        this.visible = false
      })
    }
  }

  onOk() {
    if (this.dot.type == 13) {
      playSound('tap_1')
      addNewPartner(this.dot as DotHero)

    } else if (this.dot.type == 14) {
      playSound('tap_1')
      sleepInHotel((this.dot as DotHotel).price)
    }

    this.onClose()
  }

  open(dot: Dot) {
    this.dot = dot

    if (dot.type == 13) {
      let d = dot as DotHero
      this.message.text = $t('npc.' + d.message)

    } else if (dot.type == 14) {
      let d = dot as DotHotel
      this.message.text = `客官要住宿吗？\n每人${d.price}灵石`
    }

    this.visible = true
    tween(this.position).to({ y: 30 }, 300, Ease.backOut)
  }
}