import { Point } from "pixi.js"

let { random, ceil, floor, round, abs, pow, sqrt, max, min, PI } = Math

/**
 * 获取指定范围内递增n的整数数组，包含开始数字
 * @param begin 
 * @param end 
 * @param increasing 默认1
 */
function scope(begin: number, length: number, increasing: number = 1): number[] {
  let a: number[] = []
  for (let i = 0; i < length; i++) {
    a.push(begin + i * increasing)
  }
  return a
}

/**
 * 计算两个点之间的距离
 * @param point1 
 * @param point2 
 */
function distance(point1: Point, point2: Point) {
  return abs(point1.x - point2.x) + abs(point1.y - point2.y)
}

export { random, abs, ceil, floor, round, pow, sqrt, max, min, PI, scope, distance }