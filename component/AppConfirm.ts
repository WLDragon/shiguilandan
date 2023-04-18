
import { Container, Text } from 'pixi.js';
import { Ease, tween } from "../utils/tween"
import { HEIGHT, LAYER_CONFIRM, WIDTH, COLOR_LIGHT, COLOR_DEEP } from '../game/constant';
import { ox, OContainer, OText } from 'oixi2';
import { AppButton, XAppButton } from './AppButton';
import { $t } from '../utils/i18n';
import { AppRect } from './AppRect';
import { playSound } from '../utils/sound';
import { AppBox } from './AppBox';
import { floor } from '../utils/math';
import { tempData } from '../game/dataTemp';

class XAppConfirm extends Container {
  callBackOk: Function
  callBackCancel: Function
  box: Container = null
  text: Text = null
  btnOk: XAppButton = null
  btnCancel: XAppButton = null

  constructor() {
    super()
    ox(this, null, () => [
      AppRect(WIDTH, HEIGHT, 0, 'alpha=0.4 interactive=1'),
      OContainer('#box pivot.x=120 pivot.y=90 y=180 x=' + floor(WIDTH / 2), [
        AppBox(240, 180, null, COLOR_LIGHT, COLOR_DEEP, 0, 2),
        OText('#text anchor.x=0.5 x=120 y=20', { fill: 0, wordWrap: true, wordWrapWidth: 228, breakWords: true, align: 'center', leading: 4 }),
        AppButton('#btnCancel x=75 y=150 @pointertap=onCancel', 'btn1.png', '取消', 14, COLOR_LIGHT),
        AppButton('#btnOk x=165 y=150 @pointertap=onOk', 'btn1.png', '确定', 14, COLOR_LIGHT),
      ])
    ])

    LAYER_CONFIRM.addChild(this)
    this.reset()
  }

  onOk() {
    playSound('tap_1')
    if (this.callBackOk) {
      this.callBackOk()
    }
    this.reset()
  }

  onCancel() {
    playSound('tap_3')
    if (this.callBackCancel) {
      this.callBackCancel()
    }
    this.reset()
  }

  reset() {
    tempData.isStopMove = false

    this.callBackOk = null
    this.callBackCancel = null
    this.box.scale.set(0)
    LAYER_CONFIRM.visible = false
  }

  show(text: string, ok?: Function, cancel?: Function) {
    tempData.isStopMove = true

    this.callBackOk = ok
    this.callBackCancel = cancel
    this.text.text = text

    if (!ok && !cancel) {
      this.btnOk.x = 120
      this.btnCancel.visible = false
    } else {
      this.btnOk.x = 165
      this.btnCancel.visible = true
    }

    LAYER_CONFIRM.visible = true
    tween(this.box.scale).to({ x: 1, y: 1 }, 300, Ease.backOut)
  }
}

let xac: XAppConfirm = null
/**
 * 确认框
 */
export function confirm(key: string, ok?: Function, cancel?: Function, ...rest: string[]) {
  if (!xac) {
    xac = new XAppConfirm()
  }
  xac.show($t(key, ...rest), ok, cancel)
}

export function confirmText(text: string, ok?: Function, cancel?: Function) {
  if (!xac) {
    xac = new XAppConfirm()
  }
  xac.show(text, ok, cancel)
}