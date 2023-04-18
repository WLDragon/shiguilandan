import { ox } from "oixi2"
import { Container, Texture, Sprite } from 'pixi.js';

/**
 * 图片数字
 * @param attributes 
 * @param prefix 图片资源前缀
 * @param wide 图片资源宽度
 */
export function AppNumber(attributes: string, prefix = 'n', wide = 8) {
  return ox(new XAppNumber(prefix, wide), attributes)
}

export class XAppNumber extends Container {
  private _value: string
  private prefix: string
  private wide: number

  constructor(prefix: string, wide: number) {
    super()
    this.prefix = prefix
    this.wide = wide
  }

  /**
   * 设置数字
   * @param value 为了支持'0'开头，所以使用字符串类型
   */
  setValue(v: string | number) {
    let value = v.toString()
    this._value = value
    let p = this.prefix
    let w = this.wide
    for (let i = 0; i < value.length; i++) {
      let n = value.charAt(i)
      let t = Texture.from(`${p}${n}.png`)
      let c = this.children[i] as Sprite
      if (c) {
        c.texture = t
      } else {
        let s = new Sprite(t)
        this.addChild(s)
        s.x = i * w
      }
    }

    if (this.children.length > value.length) {
      this.removeChildren(value.length)
    }
  }

  getValue(): string {
    return this._value
  }
}