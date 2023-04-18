import { Dot } from './Dot';

/**路人 */
export class DotNpc extends Dot {
  skin: string

  message: number

  w: number

  h: number

  /**NPC会走动，所以需要记录原始位置才能确定移动范围 */
  ox: number
  oy: number

  constructor(id: number, x: number, y: number, w: number, h: number, skin: string, message: number) {
    super()
    this.id = id
    this.x = this.ox = x
    this.y = this.oy = y
    this.w = w
    this.h = h
    this.skin = skin
    this.message = message
    this.type = 7
  }
}