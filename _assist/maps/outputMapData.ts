/// 输出地图数据

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseStringPromise } from 'xml2js'
import { MapData, paserMapData2SceneObjects } from './paserMapData';
import { objectToBuffer } from '../../binary/serialization';
import { SceneDataIndex } from '../../model/SceneDataIndex';

let assetsPath = resolve(__dirname, '../../public/assets')
if (!existsSync(assetsPath)) {
  mkdirSync(assetsPath)
}

const OUTPUT_DIR = resolve(__dirname, '../../public/assets/scenes.bin')
const INPUT_DIR = resolve(__dirname, './datas')


const MAP_DATAS = readdirSync(INPUT_DIR)

let promises = MAP_DATAS.map(n => {
  let xml = readFileSync(resolve(INPUT_DIR, n), 'utf-8')
  return parseStringPromise(xml, { trim: true })
})


Promise.all(promises).then((results: MapData[]) => {
  let startIndex = 0
  let buffers: Uint8Array[] = []
  let objIndex: { indexs: SceneDataIndex[] } = { indexs: [] }

  for (let i = 0; i < results.length; i++) {
    let ret = results[i]
    let sceneName = MAP_DATAS[i].split('.')[0]

    let obj = paserMapData2SceneObjects(sceneName, ret)
    let buf = objectToBuffer(obj as {})
    buffers.push(buf)

    let idx = new SceneDataIndex
    idx.name_s = sceneName
    idx.start_32 = startIndex
    idx.end_32 = startIndex + buf.length

    startIndex = idx.end_32
    objIndex.indexs.push(idx)
  }

  let idxBuf = objectToBuffer(objIndex)

  //把索引和数据打包到一起
  let indexLength = idxBuf.byteLength
  let dataLength = buffers.reduce((a, b) => a + b.byteLength, 0)

  //数据结构[[4][indexBuffer][sceneBuffer][sceneBuffer]...]
  let content = new Uint8Array(4 + indexLength + dataLength)

  content[0] = (indexLength & 0xFF000000) >> 24
  content[1] = (indexLength & 0x00FF0000) >> 16
  content[2] = (indexLength & 0x0000FF00) >> 8
  content[3] = indexLength & 0x000000FF

  content.set(idxBuf, 4)

  buffers.reduce((p, b) => {
    content.set(b, p)
    return p + b.byteLength
  }, 4 + indexLength)

  //输出到指定路径
  writeFileSync(OUTPUT_DIR, content)
})