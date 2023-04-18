import ByteWriter from '../binary/ByteWriter'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { deflateRaw } from 'pako'
import { parseStringPromise } from 'xml2js'

let assetsPath = resolve(__dirname, '../public/assets')
if (!existsSync(assetsPath)) {
  mkdirSync(assetsPath)
}

type ModelData = {
  Workbook: {
    Worksheet: {
      $: { ['ss:Name']: string },
      Table: {
        Row: {
          Cell: {
            Data: { _: string }[]
          }[]
        }[]
      }[]
    }[]
  }
}

const OUT_PUT = resolve(__dirname, `../public/assets/config.bin`)

let prefix = resolve(__dirname, `./config/`)

let files = readdirSync(prefix).filter(p => /.+\.xml$/.test(p))
let xmlDatas = files.map(fileName => {
  let xml = readFileSync(resolve(prefix, fileName), 'utf8')
  return parseStringPromise(xml, { trim: true })
})

let results: ArrayBuffer[] = []

Promise.all(xmlDatas).then((objects: ModelData[]) => {
  objects.forEach((obj: ModelData) => {
    results.push(handleFile(obj))
  })
  packFiles(results)
})

function handleFile(obj: ModelData) {
  let rows = obj.Workbook.Worksheet[0].Table[0].Row
  let bytes = new ByteWriter()
  let row1 = rows.shift()
  if (row1) {
    bytes.setString(obj.Workbook.Worksheet[0].$['ss:Name']) //设置文件名
    bytes.setString(row1.Cell.map(c => c.Data[0]._).join('ส็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็')) //设置键名

    let keys = row1.Cell.map(c => c.Data[0]._)
    let n = keys.length
    rows.forEach(row => {
      for (let i = 0; i < n; i++) {
        let t = keys[i]
        let c = row.Cell[i]
        let v = c ? c.Data[0]._ : ''
        switch (t.split('_')[1]) {
          case '8':
            bytes.setUint8(v ? Number(v) : 0)
            break;
          case '16':
            bytes.setUint16(v ? Number(v) : 0)
            break;
          case '32':
            bytes.setUint32(v ? Number(v) : 0)
            break;
          default:
            bytes.setString(v)
            break;
        }
      }
    })
  }

  return bytes.getBuffer()
}

/**
 * 打包数据输入到指定目录
 * @param {Array<ArrayBuffer>} datas
 */
function packFiles(datas) {
  let dataLength = datas.reduce((a, b) => a + b.byteLength, 0)
  let headLength = datas.length * 4
  let content = new Uint8Array(dataLength + headLength)

  datas.reduce((p, b) => {
    let len = b.byteLength
    //用四个字节来记录数据的长度
    let bite1 = (len & 0xFF000000) >> 24
    let bite2 = (len & 0x00FF0000) >> 16
    let bite3 = (len & 0x0000FF00) >> 8
    let bite4 = len & 0x000000FF
    content.set([bite1], p)
    content.set([bite2], p + 1)
    content.set([bite3], p + 2)
    content.set([bite4], p + 3)
    //写入内容
    content.set(new Uint8Array(b), p + 4)

    return p + len + 4
  }, 0)

  //压缩文件
  content = deflateRaw(content)
  //输出到指定路径
  writeFileSync(OUT_PUT, content)
}