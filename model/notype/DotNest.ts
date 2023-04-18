import { Dot } from './Dot';

/**妖怪巢穴 */
export class DotNest extends Dot {

  w: number

  h: number

  /**战斗时的背景图片 1-森林 2-地洞 3-宗门 4-山上 5-海底 */
  bg: number

  ogres: number[]

}