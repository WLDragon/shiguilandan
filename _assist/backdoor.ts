import * as db from '../game/database';
import * as app from '../game/app';
import { increaseGoods } from '../game/dataManager';
import Hero from '../model/Hero';
import { emit } from '../utils/emitter';
import { EVENT_SCENE, EVENT_UPDATE_LEFT_TOP } from '../game/constant';
import { tipsText } from '../component/AppTips';
import { equipGoods } from '../game/handleGoodsEquip';
import { getGoodsById } from '../game/app';
import { GoodsEquip } from '../model/GoodsEquip';

if (process.env.NODE_ENV == 'development') {
  let backdoor = {
    getCommon() {
      return db.getCommon()
    },
    addGoods(id: number, n: number = 1) {
      let g = app.getGoodsById(id)
      if (g) {
        increaseGoods(g, n)
      } else {
        console.log('没有物品：' + id)
      }
    },
    setGem(gem: number) {
      db.getTeam().gem_32 = gem
    },
    upgradeByHeroId(heroId: number, grade: number, level: number) {
      let h = db.getHero(heroId)
      h.grade_8 = grade
      h.level_8 = level
      let totalLevel = grade * 10 + level
      if (totalLevel > 0) {
        let u = app.getUpgrade(totalLevel - 1)
        h.exp_32 = u.upgrade_32
      }
      app.upgrade2Level(h, grade * 10 + level)
    },
    addHero(id: number) {
      let hero = new Hero
      let conf = app.getConfigHeroById(id)
      for (let k in conf) {
        hero[k] = conf[k]
      }

      let totalLevel = hero.grade_8 * 10 + hero.level_8
      let upGradeConfig = app.getUpgrade(totalLevel - 1)
      app.upgrade2Level(hero, totalLevel)
      hero.exp_32 = upGradeConfig.upgrade_32 + 1
      db.addHero(hero)
      emit(EVENT_UPDATE_LEFT_TOP)
      tipsText(`${app.getHeroName(hero)}加入队伍`)
    },
    addAllGoods() {
      this.addGoods(1001, 100)
      this.addGoods(1002, 100)
      this.addGoods(1003, 100)
      this.addGoods(1004, 100)
      this.addGoods(1005, 100)
      this.addGoods(1006, 100)
      this.addGoods(1007, 100)
      this.addGoods(3001, 100)
      this.addGoods(3002, 100)
      this.addGoods(3003, 100)
      this.addGoods(3004, 100)
      this.addGoods(3005, 100)
      this.addGoods(3006, 100)
      this.addGoods(3007, 100)
      this.addGoods(4001, 100)
      this.addGoods(4002, 100)
      this.addGoods(4003, 100)
      this.addGoods(4004, 100)
      this.addGoods(4005, 100)
      this.addGoods(4006, 100)
      this.addGoods(4007, 100)
      this.addGoods(4008, 100)
      this.addGoods(4009, 100)
    },
    test() {
      this.addHero(2)
      // this.addHero(3)
      this.upgradeByHeroId(1, 1, 7)
      this.upgradeByHeroId(2, 1, 2)
      // this.upgradeByHeroId(3, 1, 9)
      this.addGoods(2007, 3)
      this.addGoods(2008, 3)
      this.addGoods(2009, 3)
      this.addGoods(1003, 10)
      this.addGoods(1008, 12)
      this.addGoods(1009, 2)
      this.addGoods(3002, 3)
      this.addGoods(5008, 1)
      let h1 = db.getHero(1)
      let h2 = db.getHero(2)
      // let h3 = db.getHero(3)
      equipGoods(h1, getGoodsById(2007) as GoodsEquip)
      equipGoods(h1, getGoodsById(2008) as GoodsEquip)
      equipGoods(h1, getGoodsById(2009) as GoodsEquip)
      equipGoods(h2, getGoodsById(2007) as GoodsEquip)
      equipGoods(h2, getGoodsById(2008) as GoodsEquip)
      equipGoods(h2, getGoodsById(2009) as GoodsEquip)
      // equipGoods(h3, getGoodsById(2007) as GoodsEquip)
      // equipGoods(h3, getGoodsById(2008) as GoodsEquip)
      // equipGoods(h3, getGoodsById(2009) as GoodsEquip)

      emit(EVENT_SCENE, '000', 46, 237)
    }
  }
  window['_'] = backdoor
}