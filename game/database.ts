import { bufferToObject, objectToBuffer } from "../binary/serialization";
import { read, write, deleteFile } from '../native/h2n';
import Common from "../model/Common";
import Hero from '../model/Hero';
import { Team } from '../model/Team';
import { Scene } from '../model/Scene';
import { getSceneFromSceneData } from './sceneConfig';
import { Dot } from '../model/notype/Dot';
import { remove } from '../utils/others';
import { _GoodsQuantity } from '../model/notype/_GoodsQuantity';
import { DOWN, LEFT, UP } from "./constant";

type Database = {
  common: Common[],
  scenes: Scene[],
  heros: Hero[],
  team: Team[]
}

let db: Database = null

export function initDatabase(firstHero: Hero) {
  db = {
    common: [new Common],
    team: [new Team],
    scenes: [],
    heros: [firstHero]
  }
}

export function getCommon(): Common {
  return db.common[0]
}

export function getTeam(): Team {
  return db.team[0]
}

export function getScene(name: string): Scene {
  let scn = db.scenes.find(s => s.name_s == name)
  if (!scn) {
    scn = getSceneFromSceneData(name)
    db.scenes.push(scn)
  }

  return scn
}

export function removeSceneDot(sceneName: string, dot: Dot, isTouchDot: boolean) {
  let scn = getScene(sceneName)
  remove(dot, isTouchDot ? scn.touchDots_o : scn.nearDots_o)
}

export function getHeros(): Hero[] {
  return db.heros
}

export function getHero(id: number): Hero {
  return db.heros.find(h => h.id_16 == id)
}

export function addHero(data: Hero) {
  db.heros.push(data)
}

export function getGoodsContainerByType(type: number): _GoodsQuantity[] {
  let team = db.team[0]
  let arr: _GoodsQuantity[]
  if (type == 0) {
    arr = [].concat(team.elixirs_a, team.equips_a, team.talismans_a, team.others_a)
  } else if (type == 1) {
    arr = team.elixirs_a
  } else if (type == 2) {
    arr = team.equips_a
  } else if (type == 3) {
    arr = team.talismans_a
  } else if (type == 4) {
    arr = team.magics_a
  } else if (type == 5) {
    arr = team.others_a
  }

  return arr
}

/**获取正前方的触碰点 */
export function findAheadNearDot(): Dot {
  let c = getCommon()
  let nx = c.sceneX_16
  let ny = c.sceneY_16

  if (c.direct_8 == UP) {
    ny--
  } else if (c.direct_8 == DOWN) {
    ny++
  } else if (c.direct_8 == LEFT) {
    nx--
  } else {
    nx++
  }

  return getScene(c.scene_s).nearDots_o.find(d => (d.x == nx && d.y == ny))
}

/**存档 */
export function writeData(recordId: number) {
  let data = objectToBuffer(db)
  let dataName = 'data' + recordId
  return write(dataName, data)
}

/**读档 */
export function readData(recordId: number) {
  let dataName = 'data' + recordId
  return read(dataName).then(buffer => {
    if (buffer) {
      db = bufferToObject(buffer) as Database
    } else {
      throw Error('no record:' + dataName)
    }
  })
}

/**删档 */
export function deleteData(recordId: number) {
  deleteFile('data' + recordId)
}