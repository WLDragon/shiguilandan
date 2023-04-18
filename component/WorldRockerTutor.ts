import { OSprite, ox, OText } from 'oixi2';
import { Container, Sprite, Text } from 'pixi.js';
import { WIDTH, COLOR_WHITE } from '../game/constant';
import { settings } from '../game/dataSaved';
import { floor } from '../utils/math';
import { ITween, tween } from '../utils/tween'
import { tipsText } from './AppTips';

export function WorldRockerTutor(attributes: string) {
  return ox(new XWorldRockerTutor, attributes, () => [
    OText('#tips anchor=0.5 y=70 x=' + floor(WIDTH / 2), { fill: COLOR_WHITE, fontSize: 24, stroke: 0, strokeThickness: 2 }),
    OSprite('#finger', 'finger.png')
  ])
}

export class XWorldRockerTutor extends Container {
  private finger: Sprite = null
  private tips: Text = null
  private animataion: ITween

  next() {
    if (this.animataion) {
      this.animataion.clear()
      this.animataion = null
    }

    if (settings.rockerTutor == 0) {
      this.tips.text = '请使用右手向左划动'
      this.finger.y = 155
      this.animataion = tween(this.finger.position, 0)
        .to({ x: WIDTH - 60 }, 0)
        .to({ x: WIDTH - 200 }, 1500)

    } else if (settings.rockerTutor == 1) {
      this.tips.text = '请使用左手向下划动'
      this.finger.angle = 90
      this.finger.x = 140
      this.animataion = tween(this.finger.position, 0)
        .to({ y: 80 }, 0)
        .to({ y: 220 }, 1500)

    } else {
      tipsText("请双手交替操作摇杆")
      this.visible = false
    }
  }
}