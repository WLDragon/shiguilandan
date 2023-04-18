import { Dot } from './notype/Dot';
import { DotNest } from './notype/DotNest';
export class Scene {
  name_s: string

  /**已经移动到上面才触发的Dot */
  touchDots_o: Dot[] = []

  /**即将触碰时触发的Dot */
  nearDots_o: Dot[] = []

  /**妖兽区域，虽然暂时没有存档的必要，但不确定以后的需求，所以一并存档 */
  nestDots_o: DotNest[] = []
}