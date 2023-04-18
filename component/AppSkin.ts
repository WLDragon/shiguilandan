import { ox } from 'oixi2';
import { Rectangle, Sprite, Texture, Container } from 'pixi.js';
import { LEFT, RIGHT } from '../game/constant';
import { remove } from '../utils/others';

export function AppSkin(attributes: string, skin?: string, shadow = false) {
  return ox(new XAppSkin(skin, shadow), attributes)
}

export class XAppSkin extends Container {
  shadow: Sprite
  display: Sprite = null

  skin: string
  _direct: number

  private isFrame1 = false
  private time = 0

  constructor(skin: string, useShadow: boolean) {
    super()

    if (useShadow) {
      this.shadow = new Sprite()
      this.shadow.position.set(2, 29)
      this.addChild(this.shadow)
    }

    this.display = new Sprite
    this.display.anchor.set(0.5)
    this.display.position.set(16)
    this.addChild(this.display)

    this.skin = skin
    this.direct = LEFT
    this.updateTexture()
  }

  updateTexture() {
    if (this.skin) {
      if (this._direct == RIGHT && this.display.scale.x == 1) {
        this.display.scale.x = -1

      } else if (this._direct == LEFT && this.display.scale.x == -1) {
        this.display.scale.x = 1
      }

      this.display.texture = getFrameByDirect(this.skin, this.isFrame1)
      if (this.shadow) {
        let st = this.isFrame1 ? 'shadow1.png' : 'shadow2.png'
        this.shadow.texture = Texture.from(st)
      }

    } else {
      this.display.texture = null
      if (this.shadow) {
        this.shadow.texture = null
      }
    }
  }

  get direct(): number {
    return this._direct
  }

  set direct(value: number) {
    this._direct = value
    this.updateTexture()
  }

  play() {
    playHeroMovie(this)
  }

  /**当人物不在屏幕上时应该执行停止减少资源消耗 */
  stop() {
    stopHeroMovie(this)
  }

  step(time: number) {
    if (time - this.time > 200) {
      this.time = time
      this.isFrame1 = !this.isFrame1
      this.updateTexture()
    }
  }
}

///=========================================================
/**人物动画管理系统 */
const HERO_SET: XAppSkin[] = []

function heroMovieStep() {
  let time = Date.now()
  HERO_SET.forEach(h => h.step(time))
  requestAnimationFrame(heroMovieStep)
}

requestAnimationFrame(heroMovieStep)

function playHeroMovie(hero: XAppSkin) {
  if (!HERO_SET.includes(hero)) {
    HERO_SET.push(hero)
  }
}

function stopHeroMovie(hero: XAppSkin) {
  remove(hero, HERO_SET)
}

/**人物纹理集 */
const HERO_TEXTURE_SET: { [x in string]: Texture[] } = {}

function getFrameByDirect(skin: string, isFrame1: boolean) {
  if (!HERO_TEXTURE_SET[skin]) {
    HERO_TEXTURE_SET[skin] = []
  }

  let index = isFrame1 ? 0 : 1

  if (!HERO_TEXTURE_SET[skin][index]) {
    let bt = Texture.from(skin + '.png')
    let rect = new Rectangle(index * 32, 0, 32, 32)
    rect.x += bt.frame.x
    rect.y += bt.frame.y
    HERO_TEXTURE_SET[skin][index] = new Texture(bt.baseTexture, rect)
  }

  return HERO_TEXTURE_SET[skin][index]
}

export function stopAllHeroMovie() {
  HERO_SET.length = 0
}