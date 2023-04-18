import { OSprite, ox } from 'oixi2'
import { Container, Sprite, Texture } from 'pixi.js'
import { tipsText } from './AppTips';
import { goHome, saveData } from '../game/app';
import { confirmText } from './AppConfirm';
import { playSound, toggleMusic, toggleSound } from '../utils/sound';
import { saveSettings, settings } from '../game/dataSaved';

export function WorldMenu(attributes: string) {
  return ox(new XWorldMenu, attributes, () => [
    OSprite('@pointertap=onSave', 'ico_save.png'),
    OSprite('#icoRocker x=42 @pointertap=onChangeRocker', 'ico_rocker.png'),
    OSprite('#iconMusic x=84 @pointertap=onToggleMusic'),
    OSprite('#iconSound x=126 @pointertap=onToggleSound'),
    OSprite('@pointertap=onHome x=168', 'ico_home.png')
  ]).build()
}

export class XWorldMenu extends Container {
  iconMusic: Sprite = null
  iconSound: Sprite = null
  icoRocker: Sprite = null

  build() {
    this.updateIconMusic()
    this.updateIconSound()
    return this
  }

  onSave() {
    playSound('tap_1')
    saveData().then(() => {
      tipsText('已保存数据')
    })
  }

  onChangeRocker() {
    if (settings.rocker) {
      settings.rocker = false
      this.icoRocker.texture = Texture.from('ico_rocker.png')

    } else {
      this.icoRocker.texture = Texture.from('ico_key.png')
      settings.rocker = true
    }

    saveSettings()
    this.emit('rocker')
  }



  onToggleMusic() {
    toggleMusic(!settings.music).then(() => {
      settings.music = !settings.music
      saveSettings()
      playSound('tap_1')
      this.updateIconMusic()
    })
  }

  onToggleSound() {
    toggleSound(!settings.sound).then(() => {
      settings.sound = !settings.sound
      saveSettings()
      playSound('tap_1')
      this.updateIconSound()
    })
  }

  updateIconMusic() {
    this.iconMusic.texture = Texture.from(settings.music ? 'ico_music1.png' : 'ico_music2.png')
  }

  updateIconSound() {
    this.iconSound.texture = Texture.from(settings.sound ? 'ico_sound1.png' : 'ico_sound2.png')
  }

  onHome() {
    playSound('tap_1')
    confirmText('确定返回主页？\n请注意存档', () => {
      goHome()
    })
  }
}