export default class Hero {
  id_16: number
  /**姓，姓名分开，为以后做结婚功能留位*/
  surname_s: string
  /**名 */
  name_s: string
  /**性别 1-男 0-女 */
  sex_8: number
  /**皮肤 */
  skin_s: string

  /**攻击 */
  attack_32: number
  attackEx_32: number = 0 //装备等加成
  /**防御 */
  defend_32: number
  defendEx_32: number = 0
  /**敏捷 */
  agile_16: number
  agileEx_16: number = 0
  /**状态 1-中毒 2-麻痹 3-混乱 4-冰冻 5-封印 */
  status_a: number[] = []
  /**灵根 1-金 2-水 3-木 4-火 5-土 */
  roots_a: number[]
  /**大等级，0凡人、1炼气、2筑基、3金丹、4元婴、5化神、6炼虚、7合体、8大乘、9渡劫 */
  grade_8: number
  /**小等阶，0~9，一层、二层。。。九层、大圆满 */
  level_8: number

  /**体力，为0时死亡 */
  hp_32: number = 0
  /**最大体力 */
  maxHp_32: number = 0
  /**法力 */
  mp_16: number = 0
  /**最大法力 */
  maxMp_16: number = 0
  /**经验 */
  exp_32: number = 0
  /**突破经验 */
  maxExp_32: number = 0

  /**法术，最多8项 */
  magics_a: number[] = []
  /**法宝，只有前三位可用，按攻防敏的顺序放 */
  equip_a: number[] = []
}