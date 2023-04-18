import { bufferToObject } from '../binary/serialization';

import { initI18n } from '../utils/i18n'
import { Loader, LoaderResource, Application, Texture, Rectangle } from 'pixi.js';
import { getCommon, getHero, writeData } from './database';
import { tempData } from './dataTemp';
import { recordList, saveRecordList } from './dataSaved';
import { formattedTime, xy2i } from '../utils/others';

import { Upgrade } from '../model/Upgrade';
import Hero from '../model/Hero';
import { ceil, floor } from '../utils/math';
import { Goods } from '../model/Goods';
import Ogre from '../model/Ogre';
import { DOWN, LEFT, RIGHT, UP, VERSION_CODE, TILE_SEA } from './constant';
import { removeAllTweens } from '../utils/tween';
import { resetRouter, to } from '../utils/router';
import { clearTips, warnText } from '../component/AppTips';
import { stopAllHeroMovie } from '../component/AppSkin';
import { playMusic } from '../utils/sound';
import { getSceneData } from './sceneConfig';
import { getGoodsQuantity } from './dataManager';

let application: Application
let configFiles: { [x: string]: any[] }

/**初始化配置文件和国际化 */
export function initConfig(data: ArrayBuffer, context: Application) {
  application = context

  let newData = new Uint8Array(data)
  configFiles = bufferToObject(newData)

  let a = ['text', 'ui', 'npc']
  let i18nConfig = {}
  a.forEach((k) => {
    i18nConfig[k] = getConfigByName('i18n_' + k)
  })
  initI18n(i18nConfig)
}

export function goHome() {
  tempData.isStopMove = false
  stopAllHeroMovie()
  removeAllTweens()
  clearTips()
  playMusic(null)
  requestAnimationFrame(() => { //确保人物资源都暂停了再释放路由
    resetRouter()
    to('Home')
  })
}

/**
 * 获取从_assist/config打包的配置文件
 * @param name 文件名，在constant.ts里配置的常量
 */
export function getConfigByName(name: string): any[] {
  if (!configFiles[name]) {
    throw Error(`no config file: ${name}.txt !-> npm run data`)
  }
  return configFiles[name]
}

export function getHeroName(hero: Hero) {
  return hero.surname_s + hero.name_s
}

export function getHeroStatus(hero: Hero) {
  let a = []
  if (hero.hp_32 == 0) {
    a.push('阵亡')

  } else if (hero.status_a.length == 0) {
    a.push('健康')

  } else {
    let c = ['中毒', '麻痹', '混乱', '冰冻', '封印']
    hero.status_a.forEach(v => a.push(c[v - 1]))
  }

  return a.join(' ')
}

export function getHeroGrade(hero: Hero) {
  let g = ['凡人', '炼气', '筑基', '金丹', '元婴', '化神', '炼虚', '合体', '大乘', '渡劫']
  let f = ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层', '大圆满']
  return g[hero.grade_8] + f[hero.level_8]
}

export function getHeroRoots(hero: Hero) {
  return hero.roots_a.map(v => getRootName(v)).join('')
}

export function getRootName(root: number) {
  return ['金', '水', '木', '火', '土'][root - 1]
}

export function getGoodsById(id: number): Goods {
  if (id) {
    //1-丹药 2-法宝 3-符箓 4-法术 5-其他 6-灵石包
    let t = floor(id / 1000)
    let fileNames = ['goods_elixir', 'goods_equip', 'goods_talisman', 'goods_magic', 'goods_other', 'goods_gems']
    let n = fileNames[t - 1]
    let g = (getConfigByName(n) as Goods[]).find(g => g.id_16 == id)
    return g
  }

  return null
}

export function getConfigHeroById(id: number) {
  return (getConfigByName('heros') as Hero[]).find(h => h.id_16 == id)
}

export function getOgreById(id: number) {
  return (getConfigByName('ogres') as Ogre[]).find(o => o.id_16 == id)
}

export function getOppositeDirect(direct: number) {
  if (direct == LEFT) {
    return RIGHT
  } else if (direct == RIGHT) {
    return LEFT
  } else if (direct == UP) {
    return DOWN
  }
  return UP
}

export function getUpgrade(level: number): Upgrade {
  return (getConfigByName('upgrade') as Upgrade[]).find(g => g.level_8 == level)
}

/**
 * 升到指定等级
 * @param totalLevel grade_8*10+level_8
 */
export function upgrade2Level(hero: Hero, totalLevel: number) {
  let u = getUpgrade(totalLevel)
  let a = u.attack_32
  let d = u.defend_32
  let e = u.agile_16
  let h = u.hp_32
  let m = u.mp_16

  if (hero.roots_a.includes(1)) {
    a += u.attack_32 * 0.15
    d += u.defend_32 * 0.1
    e -= u.agile_16 * 0.2
    h += u.hp_32 * 0.15
  }

  if (hero.roots_a.includes(2)) {
    a -= u.attack_32 * 0.05
    e += u.agile_16 * 0.05
    m += u.mp_16 * 0.15
  }

  if (hero.roots_a.includes(3)) {
    a -= u.attack_32 * 0.05
    d -= u.defend_32 * 0.05
    e += u.agile_16 * 0.15
  }

  if (hero.roots_a.includes(4)) {
    a += u.attack_32 * 0.05
    d -= u.defend_32 * 0.1
    e += u.agile_16 * 0.05
    m += u.mp_16 * 0.1
  }

  if (hero.roots_a.includes(5)) {
    a -= u.attack_32 * 0.1
    d += u.defend_32 * 0.05
    e -= u.agile_16 * 0.05
    h += u.hp_32 * 0.1
  }

  let ohp = hero.maxHp_32
  let omp = hero.maxMp_16
  hero.attack_32 = ceil(a)
  hero.defend_32 = ceil(d)
  hero.agile_16 = ceil(e)
  hero.maxHp_32 = ceil(h)
  hero.maxMp_16 = ceil(m)

  hero.hp_32 += (hero.maxHp_32 - ohp)
  hero.mp_16 += (hero.maxMp_16 - omp)
  hero.maxExp_32 = u.upgrade_32

  //金灵根没法力
  if (hero.roots_a.length == 1 && hero.roots_a[0] == 1) {
    hero.mp_16 = 0
    hero.maxMp_16 = 0
  }
}

/**检查是否可以使用缩地符 */
export function canUseFlash(): { t: number, tx: number, ty: number } {
  let c = getCommon()
  let scendData = getSceneData(c.scene_s)

  let tx = c.sceneX_16
  let ty = c.sceneY_16

  if (c.direct_8 == UP) {
    ty -= 2
  } else if (c.direct_8 == DOWN) {
    ty += 2
  } else if (c.direct_8 == LEFT) {
    tx -= 2
  } else {
    tx += 2
  }

  let i = xy2i(tx, ty, scendData.width)
  let t = scendData.terrain[i]
  if (t && (t != TILE_SEA || getGoodsQuantity(5008) > 0)) {
    return { t, tx, ty }

  } else {
    warnText('无落脚点，无法缩地！')
    return null
  }
}


export function loadBinFile(fileName: string): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    if (Loader.shared.resources[fileName]) {
      resolve(Loader.shared.resources[fileName].data)
    } else {
      Loader.shared.add({
        name: fileName,
        url: fileName + '.bin',
        loadType: LoaderResource.LOAD_TYPE.XHR,
        xhrType: LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
      })

      Loader.shared.load((loader) => {
        resolve(loader.resources[fileName].data)
      })
    }
  })
}

export function openInput(content: string, label: string, callback: (content: string) => void) {
  window['openInput'](content, label, callback)
}

export function saveData() {
  let rid = tempData.currentRecordId
  let m = recordList[rid - 1]

  m.name = `档位${m.id}：${getHeroRoots(getHero(1))}`
  m.time = formattedTime()
  m.version = VERSION_CODE
  m.empty = false

  return saveRecordList().then(() => writeData(rid))
}


const TILE_TEXTURE_CACHE: { [x in string]: Texture[] } = {}
/**获取自定义基本纹理的纹理瓦片 */
export function getTileTexture(index: number, rect: Rectangle, textureName: string) {
  if (!TILE_TEXTURE_CACHE[textureName]) {
    TILE_TEXTURE_CACHE[textureName] = []
  }

  if (!TILE_TEXTURE_CACHE[textureName][index]) {
    let bt = Texture.from(textureName)
    rect.x += bt.frame.x
    rect.y += bt.frame.y
    TILE_TEXTURE_CACHE[textureName][index] = new Texture(bt.baseTexture, rect)
  }

  return TILE_TEXTURE_CACHE[textureName][index]
}
