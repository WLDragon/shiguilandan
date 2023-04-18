import { Sprite, Texture } from 'pixi.js';
import { WIDTH, HEIGHT, LAYER_TIPS } from '../game/constant';
import { tween } from '../utils/tween'

let mask = new Sprite(Texture.WHITE)
mask.interactive = true //防止显示遮罩时还继续快速点击按钮

export function showMaskSlowly(callback: Function, interval: number = 300) {
  if (mask.width != WIDTH) {
    mask.width = WIDTH
    mask.height = HEIGHT
    mask.tint = 0
  }

  mask.alpha = 0
  LAYER_TIPS.addChildAt(mask, 0)
  tween(mask).to({ alpha: 1 }, interval).onComplete(callback)
}

export function hideMaskQuickly() {
  if (LAYER_TIPS.children.includes(mask)) {
    LAYER_TIPS.removeChild(mask)
  }
}
