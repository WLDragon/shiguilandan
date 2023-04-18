import { Dot } from "./Dot";

/**
 * 客栈
 */
export class DotHotel extends Dot {
  skin: string
  price: number

  constructor(id: number, x: number, y: number, skin: string, price: number) {
    super()
    this.id = id
    this.x = x
    this.y = y
    this.skin = skin
    this.price = price
    this.type = 14
  }
}