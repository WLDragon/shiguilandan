import { Dot } from "./Dot";

/**传送 */
export class DotTeleport extends Dot {
  scene: string

  /**传送到目标后的开始坐标 */
  sx: number

  sy: number
}