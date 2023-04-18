/// 游戏设置、存档列表记录和宝石等需要存档的共享数据
// 不要直接写到loaclStorage，因为steam的云存档无法读取localStorage数据

import pako from 'pako'
import { read, write } from '../native/h2n'
import { RecordItemData } from '../model/notype/RecordItemData';

/**存档列表 */
export let recordList: RecordItemData[] = []

export let settings = {
  /**是否同意了隐私政策 */
  agree: false,
  /**背景音乐开关 */
  music: false,
  /**音效开关 */
  sound: false,
  /**是否使用摇杆，否则使用虚拟按键 */
  rocker: true,
  /**摇杆教程步数 */
  rockerTutor: 0,
  /**pc按钮提示 */
  showKeybordTips: true
}

function initRecordItem() {
  recordList = []
  for (let i = 1; i < 10; i++) {
    recordList.push(new RecordItemData(i))
  }

  //第一个档位默认解锁
  recordList[0].name = '档位1：初始档位'
  recordList[0].locked = false
  recordList[0].empty = false
}

export function initSettings(): Promise<void> {
  return new Promise((resolve) => {
    read('settings').then(data => {
      if (data) {
        settings = JSON.parse(pako.inflateRaw(data, { to: 'string' }))
      }
      resolve()
    })
  })
}

export function initRecordList(): Promise<void> {
  return new Promise((resolve) => {
    read('record').then(data => {
      if (data) {
        recordList = JSON.parse(pako.inflateRaw(data, { to: 'string' }))
      } else {
        initRecordItem()
      }

      resolve()
    })
  })
}

export function saveSettings(): Promise<boolean> {
  return write('settings', pako.deflateRaw(JSON.stringify(settings)))
}

export function saveRecordList() {
  return write('record', pako.deflateRaw(JSON.stringify(recordList)))
}