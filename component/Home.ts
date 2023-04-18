import { ox, OContainer, OText, OSprite } from 'oixi2';
import { Container, Sprite, Texture } from 'pixi.js'
import { IRouter, to } from '../utils/router';
import { layout } from '../utils/layout';
import { getSceneData } from '../game/sceneConfig';
import { COLOR_DEEP, COLOR_WHITE, VERSION } from '../game/constant';
import { playSound, toggleMusic, toggleSound } from '../utils/sound';
import { saveSettings, settings } from '../game/dataSaved';
import { HomePolicy, XHomePolicy } from './HomePolicy';
import { tempData } from '../game/dataTemp';
import { login } from '../native/h2n';

export default function () {
  return ox(new A, null, () => [
    layout(OSprite('scale=4 @pointertap=onBegin', 'bg1.png')).centerX().target,
    OText('x=10 y=10', VERSION, { fill: COLOR_WHITE, stroke: 0, strokeThickness: 1 }),
    layout(OSprite(null, 'title.png')).top(50).centerX().target,
    layout(OContainer([
      OSprite('#iconMusic @pointertap=onToggleMusic'),
      OSprite('#iconSound x=42 @pointertap=onToggleSound'),
      OSprite('x=84 @pointertap=onOpenSetting', 'ico_setting.png'),
    ])).top(4).right(10).target,

    layout(
      OText('alpha=0.6', '请点击屏幕开始游戏', { fill: COLOR_WHITE, fontSize: 18 })
    ).top(230).centerX().target,

    layout(
      OText(null, '抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当\n适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活', { fill: COLOR_WHITE, fontSize: 12, stroke: COLOR_DEEP, strokeThickness: 4 })
    ).bottom(10).centerX().target,

    layout(OSprite(null, 'age.png')).right(10).bottom(10).target,

    HomePolicy('#policy visible=0')
  ])
}

class A extends Container implements IRouter {
  iconMusic: Sprite = null
  iconSound: Sprite = null
  policy: XHomePolicy = null

  onToggleMusic() {
    toggleMusic(!settings.music).then(() => {
      settings.music = !settings.music
      saveSettings()
      this.updateIconMusic()
      playSound('tap_1')
    })
  }

  onToggleSound() {
    toggleSound(!settings.sound).then(() => {
      settings.sound = !settings.sound
      saveSettings()
      this.updateIconSound()
      playSound('tap_1')
    })
  }

  updateIconMusic() {
    this.iconMusic.texture = Texture.from(settings.music ? 'ico_music1.png' : 'ico_music2.png')
  }

  updateIconSound() {
    this.iconSound.texture = Texture.from(settings.sound ? 'ico_sound1.png' : 'ico_sound2.png')
  }

  onOpenSetting() {
    this.policy.open()
  }

  initSound() {
    //第一次点击时初始化声音管理器才有效
    toggleMusic(settings.music)
    toggleSound(settings.sound).then(() => {
      playSound('tap_1')
    })
  }

  onBegin() {
    this.initSound()
    if (this.canEnterGame()) {
      to('Record')
    }
  }

  created(): void {
    this.updateIconMusic()
    this.updateIconSound()

    //由于大地图数据过大，在首次进入游戏时就初始化，不然首次进入大地图时会卡一下
    getSceneData('000')
  }

  /**同意了隐私政策并登录后才能进入游戏 */
  canEnterGame(): boolean {
    if (!settings.agree) {
      this.policy.open()
      return false
    }

    if (!tempData.isLogin) {
      login()
      return false
    }

    return true
  }

  actived(param?: any): void {
    this.canEnterGame()
  }
}