import Hero from '../model/Hero';
import Ogre from '../model/Ogre';
import { DotBoss } from '../model/notype/DotBoss';
/// 各种不需要保存到本地的临时全局数据

class DataTemp {
  /**是否已经登录，没登录不允许玩家进入游戏 */
  isLogin = false

  /**存档位id */
  currentRecordId = 1

  /**停止移动，当开始切换到战斗的动画时要先停止移动 */
  isStopMove = false
  /**1-地图 2-村子 3-屋内 4-洞窟 5-山上，用于判断使用物品时的环境 */
  mapType: number

  /**是否是自动战斗 */
  battleAutoAction: boolean
  /**战斗时的英雄数据，直接从database引用 */
  battleHeros: Hero[]
  /**战斗时的怪物数据，因为会重复修改，所以从配置表克隆 */
  battleOgres: Ogre[]
  /**选择的战斗行动：1-攻击 2-法术 3-丹药 4-符箓 */
  battleType: number
  /**选择的战斗物品 */
  battleGoodsId: number
  /**正在与之进行战斗的BOSS触碰点 */
  battleBossDot: DotBoss

  /**是否使用了逃跑符或法术 */
  battleEscape: boolean
  /**是否隐身了 */
  isStealth = false
}

export let tempData = new DataTemp