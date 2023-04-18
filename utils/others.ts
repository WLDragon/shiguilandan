import { floor, random } from "./math";

/**打乱数组 */
export function breakArrayRank(arr: any[]) {
  let n = arr.length
  if (n >= 2) {
    for (let i = 0; i < n; i++) {
      let j = floor(random() * n)
      let t = arr[i]
      arr[i] = arr[j]
      arr[j] = t
    }
  }
}

/**
 * 安全移除数组项
 * 避免出现项不在数组中的特殊情况时删错数据
 */
export function remove<T>(item: T, array: T[]) {
  let i = array.indexOf(item)
  if (i > -1) {
    array.splice(i, 1)
  }
}

/**
 * 深拷贝对象
 * @param target 被拷贝的对象
 * @returns 新对象
 */
export function copyObject<T>(target: T): T {
  return JSON.parse(JSON.stringify(target))
}

/**用字符补齐长度，String.prototype.padStart的polyfill */
export function padStart(target: string, length: number, padString = '0'): string {
  let n = length - target.length
  if (n > 0) {
    for (let i = 0; i < n; i++) {
      target = padString + target
    }
  }
  return target
}

/**
 * 格式化的当前时间
 */
export function formattedTime() {
  let time = new Date()

  return time.getFullYear() +
    '-' + padStart((time.getMonth() + 1).toString(), 2) +
    '-' + padStart(time.getDate().toString(), 2) +
    ' ' + padStart(time.getHours().toString(), 2) +
    ':' + padStart(time.getMinutes().toString(), 2) +
    ':' + padStart(time.getSeconds().toString(), 2)
}

export function xy2i(x: number, y: number, width: number): number {
  return y * width + x
}

export function i2x(i: number, width: number): number {
  return i % width
}

export function i2y(i: number, width: number): number {
  return floor(i / width)
}