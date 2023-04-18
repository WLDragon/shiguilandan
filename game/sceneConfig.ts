import pako from "pako"
import { bufferToObject } from "../binary/serialization"
import { Dot } from "../model/notype/Dot"
import { SceneData } from "../model/notype/SceneData"
import { SceneDataIndex } from "../model/SceneDataIndex"
import { Scene } from '../model/Scene';
import { DotNpc } from '../model/notype/DotNpc';
import { DotNest } from '../model/notype/DotNest';

let rawSceneData: Uint8Array
let rawOffsetPosition: number
let sceneIndexs: SceneDataIndex[]
let sceneDatas: SceneData[] = []

export function initSceneData(data: ArrayBuffer) {
  rawSceneData = new Uint8Array(data)
  let b1 = rawSceneData[0]
  let b2 = rawSceneData[1]
  let b3 = rawSceneData[2]
  let b4 = rawSceneData[3]
  let n = (b1 << 24) | (b2 << 16) | (b3 << 8) | b4
  rawOffsetPosition = 4 + n
  let idxBuf = new Uint8Array(rawSceneData.slice(4, rawOffsetPosition))
  let o = bufferToObject(idxBuf)
  sceneIndexs = o.indexs
}

export function getSceneFromSceneData(name: string): Scene {
  let sd = getSceneData(name)
  let dots: Dot[] = JSON.parse(sd.dotsJson)

  let scn = new Scene
  scn.name_s = sd.name
  dots.forEach(d => {
    if (d.type == 15) {
      scn.nestDots_o.push(d as DotNest)

    } else if (d.type == 7) {
      let dn = d as DotNpc
      dn.ox = dn.x
      dn.oy = dn.y
      scn.nearDots_o.push(dn)

    } else if ([1, 4, 5, 6].includes(d.type)) {
      scn.touchDots_o.push(d)

    } else if ([2, 3, 8, 9, 10, 11, 12, 13, 14].includes(d.type)) {
      scn.nearDots_o.push(d)
    }
  })

  return scn
}

export function getSceneData(name: string): SceneData {
  let sd = sceneDatas.find(d => d.name == name)
  if (!sd) {
    let idx = sceneIndexs.find(x => x.name_s == name)
    if (idx) {
      sd = getSceneDataFromRaw(idx)
      sceneDatas.push(sd)
    } else {
      throw Error('no scene: ' + name)
    }
  }
  return sd
}

function getSceneDataFromRaw(idx: SceneDataIndex): SceneData {
  let b = rawOffsetPosition + idx.start_32
  let e = rawOffsetPosition + idx.end_32
  let buf = new Uint8Array(rawSceneData.slice(b, e))
  let o = bufferToObject(buf)

  let m: { name_s: string, width_16: number, height_16: number, type_8: number, tile_16: number, map_s: string, terrain_s: string, dotsJson_s: string } = o.scene[0]

  let sd = new SceneData
  sd.name = m.name_s
  sd.width = m.width_16
  sd.height = m.height_16
  sd.type = m.type_8
  sd.tile = m.tile_16
  sd.dotsJson = m.dotsJson_s
  sd.map = getMapData(m.map_s)
  sd.terrain = m.terrain_s ? getMapData(m.terrain_s) : new Uint32Array()

  return sd
}

function getMapData(rawData: string) {
  let b = atob(rawData)
  let u = new Uint8Array(b.length)
  for (let i = 0; i < b.length; i++) {
    u[i] = b.charCodeAt(i)
  }
  return new Uint32Array(pako.inflate(u).buffer)
}