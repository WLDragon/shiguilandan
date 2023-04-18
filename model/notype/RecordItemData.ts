export class RecordItemData {
  id: number
  name: string
  time: string
  version: number = 0
  empty: boolean = true
  locked: boolean = true

  constructor(id: number) {
    this.id = id
    this.name = `档位${id}：空档`
    this.time = '0000-00-00 00:00'
  }
}