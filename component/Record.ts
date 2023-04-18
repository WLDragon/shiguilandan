import { ox } from 'oixi2'
import { Container, InteractionEvent } from 'pixi.js'
import { layout } from '../utils/layout'
import { back, IRouter, to } from '../utils/router'
import { AppContainer } from './AppContainer'
import { AppDialog, XAppDialog } from './AppDialog'
import { RecordItem, XRecordItem } from './RecordItem';
import { recordList, saveRecordList } from '../game/dataSaved';
import { AppRect } from './AppRect'
import { COLOR_LIGHT, HEIGHT, WIDTH, EVENT_AD_UNLOCK_RECORD } from '../game/constant';
import { warnText } from './AppTips'
import { shake } from '../utils/shake'
import { RecordItemData } from '../model/notype/RecordItemData'
import { confirmText } from './AppConfirm'
import { showAd } from '../native/h2n'
import { off, on } from '../utils/emitter'
import { readData } from '../game/database'
import { tempData } from '../game/dataTemp'
import { playSound } from '../utils/sound'

export default function () {
  return ox(new A, null, () => [
    AppRect(WIDTH, HEIGHT, COLOR_LIGHT),
    layout(
      AppContainer('@pointertap=onItemTap', { width: 210, height: 65, column: 3 }, [
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1'),
        RecordItem('#items interactive=1')
      ])
    ).centerX().top(10).target,
    layout(
      AppDialog('#dialog @tap1=onOk @tap2=onBack', '确定', '返回')
    ).bottom().target
  ])
}

class A extends Container implements IRouter {
  items: XRecordItem[] = []
  dialog: XAppDialog = null

  selectData: RecordItemData

  onItemTap(e: InteractionEvent) {
    if (e.target instanceof XRecordItem) {
      let t = e.target
      let d = t.data

      this.selectData = null
      this.items.forEach(m => m.select(false))

      if (d.locked) {
        playSound('ask')
        //看广告解锁
        confirmText(`是否观看广告解锁【存档位${d.id}】？`, () => {
          showAd('record_' + d.id)
        })

      } else {
        playSound('tap_2')
        this.selectData = d
        t.select(true)
      }
    }
  }

  onOk() {
    if (!this.selectData) {
      warnText('请选择一个存档位')
      this.items.forEach(m => shake(m, 10))

    } else {
      playSound('tap_1')
      tempData.currentRecordId = this.selectData.id

      if (this.selectData.empty) {
        to('Roots')

      } else {
        readData(this.selectData.id)
          .then(() => to('World'))
          .catch(() => {
            to('Roots')
          })
      }
    }
  }

  onBack() {
    playSound('tap_3')
    back()
  }

  onUnlockRecord = (id: number) => {
    playSound('get')

    let d = recordList[id - 1]
    d.locked = false

    let m = this.items[id - 1]
    m.update(d)
    m.select(true)
    saveRecordList()

    this.selectData = d
  }

  actived(param?: any): void {
    let list = recordList
    this.items.forEach((m, i) => {
      m.update(list[i])
      m.select(false)
    })

    this.selectData = null

    this.dialog.sayText('请选择一个存档位\n本游戏没有自动存档功能，地图右上角有保存按钮，请手动存档')
  }

  created(): void {
    on(EVENT_AD_UNLOCK_RECORD, this.onUnlockRecord)
  }

  beforeDestroy(): void {
    off(EVENT_AD_UNLOCK_RECORD)
  }
}