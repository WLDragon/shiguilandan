import { OSprite, OText, ox } from 'oixi2'
import { Container, InteractionEvent, Sprite, Text } from 'pixi.js';
import { COLOR_DEEP, COLOR_DEEP_YELLOW } from '../game/constant';
import { RecordItemData } from '../model/notype/RecordItemData';
import { playSound } from '../utils/sound';
import { confirmText } from './AppConfirm';
import { recordList, saveRecordList } from '../game/dataSaved';

export function RecordItem(attributes: string) {
  return ox(new XRecordItem, attributes, () => [
    OSprite('#bg', 'recordBg.png'),
    OText('#mname x=10 y=10', { fontSize: 16 }),
    OText('#time x=10 y=35', { fontSize: 12 }),
    OSprite('#btnClear x=164 y=16 @pointertap=onClear', 'close3.png'),
    OSprite('#icoLock x=168 y=22', 'lock.png'),
  ])
}

export class XRecordItem extends Container {
  bg: Sprite = null
  mname: Text = null
  time: Text = null
  btnClear: Sprite = null
  icoLock: Sprite = null

  data: RecordItemData

  onClear(e: InteractionEvent) {
    e.stopPropagation()

    playSound('ask')
    confirmText(`确定清空【${this.data.name}】？`, () => {
      let id = this.data.id
      let newData = new RecordItemData(id)
      recordList[id - 1] = newData
      newData.locked = false
      this.update(newData)
      saveRecordList()
    })
  }

  update(data: RecordItemData) {
    this.data = data
    this.mname.text = data.name
    this.time.text = data.time
    this.btnClear.visible = !data.empty
    this.icoLock.visible = data.locked
  }

  select(value: boolean) {
    this.bg.tint = value ? COLOR_DEEP_YELLOW : COLOR_DEEP
  }
}