import { Scene } from '../model/Scene';
import { getScene } from './database';
import { DotBoss } from '../model/notype/DotBoss';
import { remove } from '../utils/others';
import { DotNpc } from '../model/notype/DotNpc';
import { DotHotel } from '../model/notype/DotHotel';

/**进入一个场景之前检查与之关联的点的变化 */
export function linkDotsBeforeEnterScene(scene: Scene) {
  if (scene.name_s == '107') {
    chapter107(scene)
  }
}

function chapter107(scene: Scene) {
  let s106 = getScene('106')
  let boss1 = s106.nearDots_o.find(o => o.id == 14) as DotBoss
  let boss2 = s106.nearDots_o.find(o => o.id == 16) as DotBoss
  let boss3 = s106.nearDots_o.find(o => o.id == 17) as DotBoss
  //打败四大护法其中一人才能进入内宗
  let i1 = scene.nearDots_o.findIndex(d => d.id == 1)
  if (i1 > -1) {
    if (boss1.ogres.length == 0 || boss2.ogres.length == 0 || boss3.ogres.length == 0) {
      scene.nearDots_o.splice(i1, 1)
    }
  }
  //打败四大护法才能进入禁地
  let i2 = scene.nearDots_o.findIndex(d => d.id == 9)
  if (i2 > -1) {
    if (boss1.ogres.length == 0 && boss2.ogres.length == 0 && boss3.ogres.length == 0) {
      scene.nearDots_o.splice(i2, 1)
    }
  }
}

function removeNearDotById(scene: Scene, id: number) {
  let d = scene.nearDots_o.find(d => d.id == id)
  if (d) {
    d.x = -100
    d.y = -100
    remove(d, scene.nearDots_o)
  }
}

/**战胜BOSS后检查关联的点的变化 */
export function linkDotsAfterBattle(sceneName: string) {
  let scene = getScene(sceneName)

  if (sceneName == '108') {
    removeNearDotById(scene, 7)

  } else if (sceneName == '117') {
    chapter117(scene)

  } else if (sceneName == '123') {
    removeNearDotById(scene, 4)

  } else if (sceneName == '133') {
    removeNearDotById(scene, 5)

  } else if (sceneName == '134') {
    removeNearDotById(scene, 5)
    removeNearDotById(getScene('000'), 38)

  } else if (sceneName == '135') {
    removeNearDotById(scene, 5)

  } else if (sceneName == '136') {
    removeNearDotById(scene, 6)

  }
}

function chapter117(scene: Scene) {
  //打败半兽骨妖后移除山洞的人
  if (scene.nearDots_o.find(d => d.id == 6)) {
    [2, 3, 4, 5, 6].forEach(id => {
      removeNearDotById(scene, id)
    })
  }

  //王家村移除地下商店和客栈楼上的人，添加商店和客栈
  let scene121 = getScene('121')
  let scene114 = getScene('114')
  let shop = scene121.nearDots_o.find(d => d.id == 2)
  remove(shop, scene121.nearDots_o)
  shop.id = 3
  shop.x = 4
  shop.y = 4
  scene114.nearDots_o.push(shop)

  let scene113 = getScene('113')
  let guest = scene113.nearDots_o.find(d => d.id == 2)
  remove(guest, scene113.nearDots_o)

  let scene112 = getScene('112')
  scene112.nearDots_o.push(new DotHotel(3, 12, 5, 'h005', 15))

  //王家村添加村民
  let scene111 = getScene('111')
  let npc1 = new DotNpc(10, 19, 26, 10, 1, 'h006', 11101)
  let npc2 = new DotNpc(11, 24, 10, 4, 5, 'h008', 11102)
  let npc3 = new DotNpc(12, 4, 2, 5, 3, 'h010', 11103)
  let npc4 = new DotNpc(13, 18, 13, 3, 3, 'h006', 11104)
  scene111.nearDots_o.push(npc1, npc2, npc3, npc4)

  let scene115 = getScene('115')
  scene115.nearDots_o.push(new DotNpc(14, 6, 5, 5, 2, 'h014', 11501))

  let scene116 = getScene('116')
  scene116.nearDots_o.push(new DotNpc(15, 1, 5, 2, 4, 'h013', 11601))
}
