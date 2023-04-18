import { OContainer, ox, OText } from 'oixi2';
import { Container } from 'pixi.js'
import { AppRect } from './AppRect';
import { WIDTH, HEIGHT, COLOR_GRAY_5, COLOR_LIGHT, COLOR_WHITE } from '../game/constant';
import { layout } from '../utils/layout';
import { AppButton } from './AppButton';
import { Ease, tween } from '../utils/tween'
import { tempData } from '../game/dataTemp';
import { showAd } from '../native/h2n';
import { goHome } from '../game/app';

export function WorldAllHeroDie(attributes: string) {
  return ox(new XWorldAllHeroDie, attributes, () => [
    AppRect(WIDTH, HEIGHT, 0, 'alpha=0.4 interactive=1'),
    layout(
      OContainer('#box pivot.x=95 pivot.y=110', [
        AppRect(190, 50, COLOR_GRAY_5),
        OText('anchor=0.5 x=95 y=25', '全员阵亡', { fontSize: 18 }),
        AppRect(190, 170, COLOR_LIGHT, 'y=50'),
        OText('anchor.x=0.5 x=95 y=60', '因中毒全员阵亡！', { fill: 0 }),
        AppButton('x=95 y=150 @pointertap=onReborn', 'btn7.png', '复活全体成员', 14, COLOR_WHITE),
        AppButton('x=95 y=195 @pointertap=onBack', 'btn8.png', '返回首页', 14, COLOR_LIGHT)
      ])
    ).center().target
  ])
}

export class XWorldAllHeroDie extends Container {
  box: Container = null

  onReborn() {
    showAd('reborn_0')
  }

  onBack() {
    goHome()
  }

  open() {
    tempData.isStopMove = true
    this.visible = true
    this.box.scale.set(0)
    tween(this.box.scale).to({ x: 1, y: 1 }, 300, Ease.backOut)
  }

}