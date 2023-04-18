import { Sprite, Texture } from 'pixi.js';
import { ox } from 'oixi2'

export function AppRect(width: number, height: number, color: number, attributes?: string) {
  return ox(new XAppRect(width, height, color), attributes)
}

export class XAppRect extends Sprite {
  constructor(width: number, height: number, color: number) {
    super(Texture.WHITE)

    this.width = width
    this.height = height
    this.tint = color
  }
}