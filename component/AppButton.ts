import { OText, ox } from "oixi2";
import { Sprite, Texture, Text } from 'pixi.js';

/**
 * 基础按钮，可以设置图片和文字
 * @param attributes 
 * @param skin 
 * @returns 
 */
export function AppButton(attributes: string, skin: string, label = '', labelSize = 14, labelColor = 0, id = 0) {

  return ox(new XAppButton(skin, id), attributes, () => [
    //TODO 添加容器，实现设置坐标时不需要考虑按钮宽高的一半
    OText('#_label anchor=0.5', label, { fontSize: labelSize, fill: labelColor })
  ])
}

export class XAppButton extends Sprite {

  private _label: Text = null
  private _enable: boolean = false

  id: number

  constructor(skin: string, id: number) {
    super(Texture.from(skin))

    this.id = id

    this.anchor.set(0.5)
    this.interactive = true
    this.on('pointerdown', this.onTouchstart, this)
    this.on('pointerup', this.onTouchEnd, this)
    this.on('pointerupoutside', this.onTouchEnd, this)
  }

  onTouchstart() {
    this.scale.set(0.9)
  }

  onTouchEnd() {
    this.scale.set(1)
  }

  set label(value: string) {
    this._label.text = value
  }

  set skin(value: string) {
    this.texture = Texture.from(value)
  }

  set enable(value: boolean) {
    this._enable = value
    if (value) {
      this.interactive = true
      this.alpha = 1
    } else {
      this.interactive = false
      this.alpha = 0.4
    }
  }

  get enable(): boolean {
    return this._enable
  }
}