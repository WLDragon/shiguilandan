import { Dot } from './Dot';

/**大牛 */
export class DotBoss extends Dot {
  skin: string

  /**被打后再次靠近显示的话，如果不设置则会将Boss删除 */
  message: number

  /**战斗时的背景图片 1-森林 2-地洞 3-宗门 4-山上 5-海底 */
  bg: number

  /**战斗时的妖怪配置，有可能是多只妖怪，战胜后长度设置为0 */
  ogres: number[]
}