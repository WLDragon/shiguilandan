const fs = require('fs')
const path = require('path')
const pako = require('pako')

let assetsPath = path.resolve(__dirname, '../../public/assets')
if (!fs.existsSync(assetsPath)) {
  fs.mkdirSync(assetsPath)
}

const PATH_PREFIX = './_assist/sounds/mp3/'
let soundFiles = fs.readdirSync(PATH_PREFIX)

let soundDatas = soundFiles.map(fileName => {
  let data = fs.readFileSync(PATH_PREFIX + fileName)
  let name = fileName.split('.')[0]
  let n = name.length

  //声音文件名只能用ascii码命名，否则这里会出现溢出问题
  let n8 = new Uint8Array(n + 1)
  n8[0] = n
  for (let i = 0; i < n; i++) {
    n8[i + 1] = name.charCodeAt(i)
  }

  let buffer = new Uint8Array(n8.byteLength + data.byteLength)
  buffer.set(n8)
  buffer.set(data, n8.byteLength)

  return buffer
})

let dataLength = soundDatas.reduce((a, b) => a + b.byteLength, 0)
let headLength = soundDatas.length * 3 //外加记录数据长度的头部长度
let content = new Uint8Array(dataLength + headLength)

soundDatas.reduce((p, b) => {
  let len = b.byteLength
  //用三个字节来记录数据的长度
  let high = (len & 0xFF0000) >> 16
  let midle = (len & 0x00FF00) >> 8
  let low = len & 0x0000FF
  content.set([high], p)
  content.set([midle], p + 1)
  content.set([low], p + 2)
  //写入内容
  content.set(new Uint8Array(b), p + 3)

  return p + len + 3
}, 0)

content = pako.deflateRaw(content)

fs.writeFileSync('./public/assets/sound.bin', content)