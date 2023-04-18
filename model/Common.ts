//需要存档的剧本数据
export default class Common {
  /**当前场景名称 */
  scene_s: string
  sceneX_16: number
  sceneY_16: number

  /**当前方向 */
  direct_8: number = 2

  /**在离开世界地图时记录离开的位置，用于闪退符，默认新手村位置 */
  leaveWorldX_16: number = 24
  leaveWorldY_16: number = 289

  /**外观 1-全身 2-半身 3-船 4-飞行*/
  skinStatus_8 = 1
  /**是否在遮挡地形下面 */
  isCover_8 = 0
  /**遇怪步数 */
  ogreCount_8 = 0
}