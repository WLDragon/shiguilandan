
export class SceneData {
  name: string
  width: number
  height: number
  /**
   * 1-地图 2-村子 3-屋内 4-洞窟 5-山上
   * 
   * 判断到洞穴会加遮罩
   * 像闪退符、飞行符等物品也可能需要判断使用场景
   */
  type: number
  /**用来填充没有地图块的地方 */
  tile: number
  /**地图纹理 */
  map: Uint32Array
  /**地形 */
  terrain: Uint32Array
  /**Dot[]的序列化数据，需要Json解析后传给存档数据再使用 */
  dotsJson: string
}