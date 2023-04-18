import { Goods } from "./Goods"

export class GoodsMagic extends Goods {

  /**潜力消耗 */
  mp_16: number

  /**对应灵根才能领悟 */
  root_8: number

  /**1-地图法术 2-战斗法术 3-战斗和地图都可以使用 */
  env_8: number
}