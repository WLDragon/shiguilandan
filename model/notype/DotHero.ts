import { Dot } from "./Dot";

/**
 * 可加入队伍的人物
 */
export class DotHero extends Dot {
  skin: string

  hero: number

  message: number

  constructor(id: number, x: number, y: number, skin: string, hero: number, message: number) {
    super()
    this.id = id
    this.x = x
    this.y = y
    this.skin = skin
    this.hero = hero
    this.message = message
    this.type = 13
  }
}