export default class ByteWriter {
  valueArray: number[] = []
  typeArray: number[] = []
  length: number = 0

  setUint8(value: number) {
    this.valueArray.push(value)
    this.typeArray.push(8)
    this.length += 1
  }

  setUint16(value: number) {
    this.valueArray.push(value)
    this.typeArray.push(16)
    this.length += 2
  }

  setUint32(value: number) {
    this.valueArray.push(value)
    this.typeArray.push(32)
    this.length += 4
  }

  setString(value: string) {
    let n = value.length
    if (n >= 65536) {
      throw Error('!too long:\n' + value)
    }
    this.setUint16(n)
    for (let i = 0; i < n; i++) {
      this.setUint16(value.charCodeAt(i))
    }
  }

  getBuffer(): ArrayBuffer {
    let buffer = new ArrayBuffer(this.length)
    let view = new DataView(buffer)

    let p = 0
    let n = this.valueArray.length
    for (let i = 0; i < n; i++) {
      let v = this.valueArray[i]
      let t = this.typeArray[i]

      if (t == 8) {
        view.setUint8(p++, v)

      } else if (t == 16) {
        view.setUint16(p, v)
        p += 2

      } else if (t == 32) {
        view.setUint32(p, v)
        p += 4
      }
    }

    return buffer
  }
}