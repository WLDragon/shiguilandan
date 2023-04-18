import { OContainer, ox, OText } from 'oixi2';
import { Container } from 'pixi.js'
import { AppRect } from './AppRect';
import { WIDTH, HEIGHT, COLOR_LIGHT, COLOR_DEEP, LAYER_CONFIRM } from '../game/constant';
import { floor } from '../utils/math';
import { AppBox } from './AppBox';
import { AppButton } from './AppButton';
import { Ease, tween } from "../utils/tween"
import { login, openUrl } from '../native/h2n';
import { settings, saveSettings } from '../game/dataSaved';
import { tempData } from '../game/dataTemp';

export function HomePolicy(attributes: string) {
  return ox(new XHomePolicy, attributes, () => [
    AppRect(WIDTH, HEIGHT, 0, 'alpha=0.5 interactive=1'),
    OContainer('#box pivot.x=120 pivot.y=90 y=180 x=' + floor(WIDTH / 2), [
      AppBox(240, 165, null, COLOR_LIGHT, COLOR_DEEP, 0, 2),
      OText('anchor.x=0.5 x=120 y=20', '为了更好地保障您的个人权益，在使用我们的产品前，请务必审慎阅读《隐私政策》内的全部内容', { fill: 0, wordWrap: true, wordWrapWidth: 220, breakWords: true, align: 'left', leading: 4 }),
      AppButton('x=120 y=110 @pointertap=onOpenPolicy', 'btn8.png', '阅读《隐私政策》', 14, COLOR_LIGHT),
      AppButton('x=75 y=160 @pointertap=onClose', 'btn1.png', '关闭', 14, COLOR_LIGHT),
      AppButton('x=165 y=160 @pointertap=onOk', 'btn1.png', '同意', 14, COLOR_LIGHT),
    ])
  ])
}

export class XHomePolicy extends Container {
  box: Container = null

  open() {
    this.visible = true
    LAYER_CONFIRM.addChild(this)
    LAYER_CONFIRM.visible = true
    this.box.scale.set(0)
    tween(this.box.scale).to({ x: 1, y: 1 }, 300, Ease.backOut)
  }

  onOpenPolicy() {
    openUrl('https://your privacy policy.html')
  }

  onOk() {
    settings.agree = true
    saveSettings()
    this.onClose()

    if (!tempData.isLogin) {
      login()
    }
  }

  onClose() {
    this.visible = false
    LAYER_CONFIRM.removeChild(this)
    LAYER_CONFIRM.visible = false
  }
}