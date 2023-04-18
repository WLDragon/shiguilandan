import { OSprite, OText, ox } from 'oixi2'
import { Container, Text, Sprite, InteractionEvent } from 'pixi.js';
import { AppRect } from './AppRect';
import { COLOR_LIGHT } from '../game/constant';
import { floor } from '../utils/math';
import { playSound } from '../utils/sound';
import { AppButton } from './AppButton';

export type SliderData = { min: number, max: number, stripWidth: number }

export function AppSlider(attributes: string, data: SliderData) {
  return ox(new XAppSlider(data), attributes, () => [
    AppButton('@pointertap=onLess x=16 y=16', 'slider1.png'),
    AppRect(data.stripWidth, 4, COLOR_LIGHT, 'x=36 y=14'),
    AppButton('@pointertap=onAdd y=16 x=' + (40 + 16 + data.stripWidth), 'slider2.png'),
    OSprite('#slider @pointermove=onMove @pointerdown=onStart @pointerup=onEnd @pointerupoutside=onEnd', 'slider3.png'),
    OText('#vLabel anchor.x=0.5 y=-14 x=' + (36 + floor(data.stripWidth / 2)), { fontSize: 12 })
  ])
}

export class XAppSlider extends Container {
  private vLabel: Text = null
  private slider: Sprite = null

  private range: number
  private minValue: number
  private maxValue: number
  value: number

  private lastX = -1

  constructor(data: SliderData) {
    super()
    this.minValue = data.min
    this.maxValue = data.max
    this.range = data.stripWidth - 32
  }

  onLess() {
    if (this.value > this.minValue) {
      playSound('tap_1')
      this.setValue(this.value - 1)
    } else {
      playSound('error')
    }
  }

  onAdd() {
    if (this.value < this.maxValue) {
      playSound('tap_1')
      this.setValue(this.value + 1)
    } else {
      playSound('error')
    }
  }

  onMove(e: InteractionEvent) {
    if (this.lastX >= 0) {
      let d = e.data.global.x - this.lastX
      this.lastX = e.data.global.x
      let dx = this.slider.x + d
      if (dx < 36) {
        dx = 36
      } else if (dx > 36 + this.range) {
        dx = 36 + this.range
      }
      this.slider.x = dx
      this.updateValue((this.slider.x - 36) / this.range)
    }
  }

  onStart(e: InteractionEvent) {
    this.lastX = e.data.global.x
  }

  onEnd() {
    this.lastX = -1
  }

  updateValue(rate: number) {
    this.value = floor(this.maxValue * rate)
    if (this.value < this.minValue) {
      this.setValue(this.minValue)
    } else {
      this.vLabel.text = this.value.toString()
    }
  }

  setValue(value: number) {
    this.value = value
    this.vLabel.text = value.toString()
    this.slider.x = 36 + floor(this.range * (value / this.maxValue))
  }
}