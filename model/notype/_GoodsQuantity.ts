/**
 * 物品数量结构，保存数据时会转为json，所以key用单个字母方便些
 */
export class _GoodsQuantity {
  /**id */
  i: number
  /**数量 */
  n: number

  constructor(id: number, quantity: number) {
    this.i = id
    this.n = quantity
  }
}