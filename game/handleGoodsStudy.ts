import Hero from '../model/Hero';
import { GoodsMagic } from '../model/GoodsMagic';
import { warnText, tipsText } from '../component/AppTips';
import { getHeroName, getRootName } from './app';

export function studyMagic(hero: Hero, goods: GoodsMagic) {
  if (hero.hp_32 == 0) {
    warnText('0体力者无法领悟法术')

  } else if (hero.grade_8 == 0) {
    warnText('凡人无法领悟')

  } else if (!hero.roots_a.includes(goods.root_8)) {
    warnText(`${getHeroName(hero)}没有${getRootName(goods.root_8)}灵根，领悟失败`)

  } else if (hero.magics_a.includes(goods.id_16)) {
    warnText(`${getHeroName(hero)}已领悟【${goods.name_s}】`)

  } else {
    let studyed = false
    for (let i = 0; i < 8; i++) {
      let m = hero.magics_a[i]
      if (!m) {
        studyed = true
        hero.magics_a[i] = goods.id_16
        tipsText(`${getHeroName(hero)}领悟【${goods.name_s}】`)
        break
      }
    }
    if (!studyed) {
      warnText(`${getHeroName(hero)}脑容量不够，请先遗忘掉一些法术`)
    }
  }
}

export function fogetMagic(hero: Hero, goodsId: number) {
  for (let i = 0; i < 8; i++) {
    if (hero.magics_a[i] == goodsId) {
      hero.magics_a[i] = 0
      break
    }
  }
}