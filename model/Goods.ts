export class Goods {
  id_16: number

  name_s: string

  price_32: number

  /**1-丹药 2-法宝 3-符箓 4-法术 5-其他 6-灵石包 */
  type_8: number

  /**1-地图中使用 2-战斗中使用 3-战斗和地图都可以使用 */
  env_8: number

  /**适用对象 1-队友 2-敌人 3-无须选择 */
  for_8: number

  desc_s: string
}