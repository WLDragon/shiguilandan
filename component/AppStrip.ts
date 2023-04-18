import { ox } from 'oixi2'
import { Container, Sprite } from 'pixi.js';
import { AppRect } from './AppRect';
import { COLOR_WHITE } from '../game/constant';

export function AppStrip(attributes: string, width: number, height: number, color: number) {
  return ox(new XAppStrip(width - 2), attributes, () => [
    AppRect(width, height, 0),
    AppRect(width - 2, height - 2, COLOR_WHITE, 'x=1 y=1'),
    AppRect(width - 2, height - 2, color, '#bar x=1 y=1')
  ])
}

export class XAppStrip extends Container {
  bar: Sprite = null
  stripWidth: number

  constructor(sw: number) {
    super()
    this.stripWidth = sw
  }

  /**设置长度百分比 */
  setValue(v: number) {
    this.bar.width = this.stripWidth * v
  }
}