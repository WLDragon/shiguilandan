import { Text, Container } from 'pixi.js';
import { layout } from '../utils/layout'
import { tween } from '../utils/tween'
import { COLOR_RED, COLOR_WHITE, LAYER_TIPS } from '../game/constant';
import { $t } from "../utils/i18n";
import { OContainer } from 'oixi2';
import { AppRect } from './AppRect';
import { playSound } from '../utils/sound';

function showTips(message: string, background: number) {
  let txt: Text = new Text(message, { fill: COLOR_WHITE, fontSize: 16, align: 'center' })
  txt.position.set(10, 10)
  let box: Container = OContainer([
    AppRect(20 + txt.width, 20 + txt.height, background),
    txt
  ])
  box.alpha = 0
  layout(box).center().top(180)
  LAYER_TIPS.addChild(box)

  tween(box)
    .to({ y: 70, alpha: 1 }, 300)
    .wait(1000)
    .to({ y: 0, alpha: 0 }, 700)
    .onComplete(() => {
      box.destroy(true)
    })
}

/**
 * 展示提示消息
 */
export function tips(key: string, ...rest: string[]) {
  showTips($t(key, ...rest), 0)
}

/**
 * 展示警告消息
 */
export function warn(key: string, ...rest: string[]) {
  showTips($t(key, ...rest), COLOR_RED)
  playSound('error')
}

export function tipsText(text: string, color = 0) {
  showTips(text, color)
}

export function warnText(text: string) {
  showTips(text, COLOR_RED)
  playSound('error')
}

export function clearTips() {
  LAYER_TIPS.removeChildren()
}