import { Dot } from "./Dot";

/**宝箱 */
export class DotTreasure extends Dot {
  /**为0的话就是隐形宝箱 */
  tile: number

  goods: number
}