export default class Ogre {
  id_16: number

  name_s: string

  skin_s: string

  hp_32: number

  mp_16: number

  /**101-不坏金身 */
  status_a: number[]

  /**在使用时再复制配置的hp */
  maxHp_32: number
  maxMp_16: number

  attack_32: number

  defend_32: number

  agile_16: number

  /**获胜可得经验 */
  exp_16: number

  /**获胜可得灵石 */
  gem_16: number

  /**可使用的法术 */
  magics_a: number[]

  /**每回合回复法力的量 */
  restore_16: number

  /**
   * 获胜后的奖励，BOSS的物品100%可得，小怪物品只有30%机率有 
   * 当出现多个怪物拥有物品时，只会选择第一个
   */
  goods_16: number
}