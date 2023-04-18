export default class ByteReader {
  position: number = 0
  data: DataView = null

  constructor(buffer: ArrayBuffer) {
    this.data = new DataView(buffer)
  }

  get available(): boolean {
    return this.position < this.data.buffer.byteLength
  }

  getUint8(): number {
    return this.data.getUint8(this.position++)
  }

  getUint16(): number {
    let v = this.data.getUint16(this.position)
    this.position += 2
    return v
  }

  getUint32(): number {
    let v = this.data.getUint32(this.position)
    this.position += 4
    return v
  }

  getString(): string {
    let n = this.data.getUint16(this.position)
    this.position += 2
    let p: number = this.position + n * 2
    let a: number[] = []
    for (let i = this.position; i < p; i += 2) {
      a.push(this.data.getUint16(i))
    }
    this.position = p
    //补充字符需要两个代码单元，所以不能循环使用fromCharCode获取单个字符
    return String.fromCharCode(...a)
  }
}