import { ox, OText } from 'oixi2';
import { Container, Text } from 'pixi.js'
import { AppBox } from './AppBox';
import { AppContainer } from './AppContainer';
import Hero from '../model/Hero';
import { getGoodsById, getHeroGrade, getHeroName, getHeroRoots, getHeroStatus } from '../game/app';

export function WorldInfoProperty(attributes: string) {
  return ox(new XWorldInfoProperty, attributes, () => [
    AppBox(160, 352),
    AppContainer('x=16 y=16', { height: 30 }, [
      OText('#hName'),
      OText('#hp'),
      OText('#mp'),
      OText('#status'),
      OText('#roots'),
      OText('#grade'),
      OText('#exp'),
      OText('#maxExp'),//到第十层时这里变成突破需要的丹药名
      OText('#attack'),
      OText('#defend'),
      OText('#aglie'),
    ])
  ])
}

export class XWorldInfoProperty extends Container {
  hName: Text = null
  hp: Text = null
  mp: Text = null
  status: Text = null
  roots: Text = null
  grade: Text = null
  exp: Text = null
  maxExp: Text = null
  attack: Text = null
  defend: Text = null
  aglie: Text = null

  update(h: Hero) {
    this.hName.text = '姓名：' + getHeroName(h)
    this.hp.text = '体力：' + h.hp_32 + '/' + h.maxHp_32
    this.mp.text = '法力：' + h.mp_16 + '/' + h.maxMp_16
    this.status.text = '状态：' + getHeroStatus(h)
    this.roots.text = '灵根：' + getHeroRoots(h)
    this.grade.text = '境界：' + getHeroGrade(h)
    this.exp.text = '经验：' + h.exp_32
    this.attack.text = '攻击：' + (h.attack_32 + h.attackEx_32)
    this.defend.text = '防御：' + (h.defend_32 + h.defendEx_32)
    this.aglie.text = '敏捷：' + (h.agile_16 + h.agileEx_16)

    let gIds = [1002, 1007] //TODO 增加其他突破丹
    if (h.exp_32 >= h.maxExp_32 && h.level_8 == 9) {
      let g = getGoodsById(gIds[h.grade_8])
      this.maxExp.text = '升级：' + g.name_s
    } else {
      this.maxExp.text = '升级：' + h.maxExp_32
    }
  }
}