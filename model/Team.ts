import { _GoodsQuantity } from './notype/_GoodsQuantity';
export class Team {
  gem_32: number = 0

  /**背包丹药，二维数组，第1位是物品，第2位是数量 */
  elixirs_a: _GoodsQuantity[] = []

  /**法宝 */
  equips_a: _GoodsQuantity[] = []

  /**符箓 */
  talismans_a: _GoodsQuantity[] = []

  /**法术，数量均为1 */
  magics_a: _GoodsQuantity[] = []

  /**其他物品，数量均为1 */
  others_a: _GoodsQuantity[] = []
}