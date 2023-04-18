//h5发送消息到原生系统

import { virtualAndroid } from "../game/debug"
import { WINDOW } from '../game/constant';

if (process.env.NODE_ENV == 'development') {
  virtualAndroid()
}

type Android = {
  login: () => void
  showAd: (type: string) => void
  openUrl: (url: string) => void
  writeData: (fileName: string, data: string) => string
  readData: (fileName: string) => string
  deleteData: (fileName: string) => void
}
let android: Android = WINDOW['Android']

export function openUrl(url: string) {
  android.openUrl(url)
}

/**启动平台的登录接口 */
export function login() {
  android.login()
}

/**
 * 展示广告
 */
export function showAd(type: string) {
  android.showAd(type)
}

/**
 * 将数据写入原生文件系统，因为iOS只能异步写入，所以统一使用Promise
 * @param fileName 文件名（目录由原生系统决定，不需要指定）
 * @param data 数据
 */
export function write(fileName: string, data: Uint8Array): Promise<boolean> {
  android.writeData(fileName, b2s(data))
  return Promise.resolve(true)
}

/**
 * 从原生系统中读取文件数据
 * @param fileName 文件名
 */
export function read(fileName: string): Promise<Uint8Array> {
  let data = android.readData(fileName)
  if (data) {
    return Promise.resolve(s2b(data))
  } else {
    return Promise.resolve(null)
  }
}

export function deleteFile(fileName: string) {
  android.deleteData(fileName)
}

function b2s(buffer: Uint8Array): string {
  //数据太大，不能用fromCharCode(...buffer)，否则会爆栈
  let s = ''
  for (let i = 0, n = buffer.length; i < n; i++) {
    s += String.fromCharCode(buffer[i])
  }
  return s
}

function s2b(data: string): Uint8Array {
  let n = data.length
  let buffer = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    buffer[i] = data.charCodeAt(i)
  }
  return buffer
}
