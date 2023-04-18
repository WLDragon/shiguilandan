import pako from 'pako'
import ByteReader from "./ByteReader";
import ByteWriter from "./ByteWriter";

/**
 * 将文件包数据分离成独立数据
 * @param buffer 对象数据
 */
export function bufferToObject(buffer: Uint8Array): { [x in string]: any[] } {
  //解压文件
  buffer = pako.inflateRaw(buffer)
  let len = buffer.byteLength
  let pointer = 0
  let content = new Uint8Array(buffer)

  let obj = {}
  while (pointer < len) {
    let bite1 = content[pointer]
    let bite2 = content[pointer + 1]
    let bite3 = content[pointer + 2]
    let bite4 = content[pointer + 3]
    let n = (bite1 << 24) | (bite2 << 16) | (bite3 << 8) | bite4

    let begin = pointer + 4
    let end = begin + n
    let b = content.slice(begin, end)
    pointer = end

    let { name, table } = unpackObject(b.buffer)
    obj[name] = table
  }

  return obj
}

/**
 * 将数据解析为对象
 * 8 16 32 分别表示1、2、4个字节储存类型，boolean类型用_8的01表示
 * 8(0-255) 16(0-65535) 32(0-4294967295)
 * s 表示字符串类型
 * a 表示数组，数组会转为Json保存
 * @param buffer 单个对象的数据
 */
function unpackObject(buffer: ArrayBuffer) {
  let bytes = new ByteReader(buffer)
  let name = bytes.getString()

  let keys: string[] = bytes.getString().split('ส็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็')
  //8 16 32 s a
  let types: string[] = keys.map(k => k.split('_')[1])

  let table = []

  while (bytes.available) {
    let row = {}

    let itemLength = types.length
    for (let column = 0; column < itemLength; column++) {
      let k = keys[column]
      let t = types[column]
      let v: number | string = null

      switch (t) {
        case '8':
          v = bytes.getUint8()
          break;
        case '16':
          v = bytes.getUint16()
          break;
        case '32':
          v = bytes.getUint32()
          break;
        default:
          v = bytes.getString()
          break;
      }

      if (t == 'a' || t == 's' || t == 'o') {
        let nv = v as string
        if (nv) {
          //带半角逗号的字段Excel自动添加了"
          if (nv.charAt(0) == '"' && nv.charAt(nv.length - 1) == '"') {
            nv = nv.substring(1, nv.length - 1)
          }
          row[k] = (t == 'a' || t == 'o') ? JSON.parse(nv) : nv
        } else {
          row[k] = (t == 'a') ? [] : null
        }
      } else {
        row[k] = v
      }
    }
    table.push(row)
  }

  return { name, table }
}

function getFieldsType(item) {
  let keys: string[] = []
  let types: string[] = []
  for (let k in item) {
    keys.push(k)
    types.push(k.split('_')[1])
  }
  return { keys, types }
}

function packObject(name: string, table: Object[]) {
  let { keys, types } = getFieldsType(table[0])

  let bytes = new ByteWriter()
  bytes.setString(name)
  bytes.setString(keys.join('ส็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็็'))

  table.forEach(item => {
    keys.forEach((k, i) => {
      let t = types[i]
      let v: number | string | any[] = item[k]

      if (v == undefined) {
        v = t == 's' ? '' : t == 'a' ? [] : 0
      }

      switch (t) {
        case '8':
          bytes.setUint8(v as number)
          break;
        case '16':
          bytes.setUint16(v as number)
          break;
        case '32':
          bytes.setUint32(v as number)
          break;
        case 'a':
        case 'o':
          bytes.setString(JSON.stringify(v))
          break;
        default:
          bytes.setString(v as string)
          break;
      }
    })
  })

  return bytes.getBuffer()
}

/**
 * 将集合多个数据的对象打包成二进制数据
 * @param obj \{table1:[], table2:[]\}
 */
export function objectToBuffer(obj: { [x in string]: Object[] }): Uint8Array {
  let datas = []
  Object.keys(obj).forEach(key => {
    datas.push(packObject(key, obj[key]))
  })

  let dataLength = datas.reduce((a, b) => a + b.byteLength, 0)
  let headLength = datas.length * 4
  let content = new Uint8Array(dataLength + headLength)

  datas.reduce((p, b) => {
    let len = b.byteLength
    //用四个字节来记录数据的长度
    let bite1 = (len & 0xFF000000) >>> 24
    let bite2 = (len & 0x00FF0000) >>> 16
    let bite3 = (len & 0x0000FF00) >>> 8
    let bite4 = len & 0x000000FF
    content.set([bite1], p)
    content.set([bite2], p + 1)
    content.set([bite3], p + 2)
    content.set([bite4], p + 3)
    //写入内容
    content.set(new Uint8Array(b), p + 4)

    return p + len + 4
  }, 0)

  return pako.deflateRaw(content)
}