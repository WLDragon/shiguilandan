export class Action {
  /**1-攻击 2-法术 3-丹药 4-符箓 */
  type: number
  /**发起人，id>100的为敌人 */
  source: number
  /**目标 */
  target: number
  /**发起人是否是玩家 */
  isUser: boolean
  /**法术、丹药和符箓的参数 */
  goodsId: number
  /**敏捷，用于排序 */
  agile: number
}