import { Container, Point } from "pixi.js"
import { floor } from "../utils/math"

export const VERSION = 'v1.1.9 仅供学习使用'
/**存档时要记录这个值，读档时要比对，有地图更新时需要更新世界地图 */
export const VERSION_CODE = 1

export const ZERO_POINT = new Point(0, 0)
export const WINDOW = window

//[640] * 360 的设计稿
/**屏幕高度 */
export const HEIGHT = 360
/**屏幕宽度，在浏览器确定了宽高后才能确定 */
export let WIDTH = 0

export function setSize(w: number, h: number) {
  WIDTH = (h / w > 0.6) ? HEIGHT / 0.6 : floor(w / h * HEIGHT)
}

/**白色（黑色直接用0x0不定义常量了） */
export const COLOR_WHITE = 0xffffff
/**灰色#eee */
export const COLOR_GRAY_E = 0xeeeeee
/**灰色#555 */
export const COLOR_GRAY_5 = 0x52504c
/**红色 */
export const COLOR_RED = 0xff0000
/**血条绿色 */
export const COLOR_GREEN = 0x18ec08
/**法力蓝色 */
export const COLOR_BLUE = 0x058afa
/**常用深色 */
export const COLOR_DEEP = 0x241e1a
/**常用浅色 */
export const COLOR_LIGHT = 0xcecabf
/**黄色 */
export const COLOR_YELLOW = 0xeec24a
/**选灵根的暗黄色 */
export const COLOR_DEEP_YELLOW = 0x786308
/**战斗结果面板暗金色 */
export const COLOR_DEEP_GOLD = 0xa47905
/**中毒后叠加的绿色 */
export const COLOR_POISON = 0x55fe02
/**不坏金身亮黄色 */
export const COLOR_LIGHT_YELLOW = 0xffff00
/**虚弱时叠加的粉红色 */
export const COLOR_PINK = 0xfd887f


/**方向，上 */
export const UP = 1
/**方向，下 */
export const DOWN = 2
/**方向，左 */
export const LEFT = 3
/**方向，右 */
export const RIGHT = 4


/**显示层-路由层 */
export const LAYER_ROUTER: Container = new Container
/**显示层-确认对话框层 */
export const LAYER_CONFIRM: Container = new Container
/**显示层-提示语层 */
export const LAYER_TIPS: Container = new Container

/// emitter的消息名
/**切换场景 */
export const EVENT_SCENE = 1
/**NPC情报 */
export const EVENT_DIALOG = 2
/**重新定位场景，可以刷新NPC和障碍等的位置 */
export const EVENT_SCENE_REFRESH = 3
/**移除Dot的显示对象 */
export const EVENT_REMOVE_DOT = 4
/**打开商店 */
export const EVENT_SHOP = 5
/**战斗 英雄选择战斗方案 */
export const EVENT_BATTLE_CHOOSE_ACTION = 6
/**执行战斗行为 */
export const EVENT_BATTLE_ACTION = 7
/**停止人物行为动画 */
export const EVENT_STOP_HERO_PLAY = 8
/**显示战斗结果 */
export const EVENT_BATTLE_RESULT = 9
/**打开客栈，新英雄，医院，道士等需要询问的功能 */
export const EVENT_INQUIRE = 10
/**更新地图左上角人物体力等 */
export const EVENT_UPDATE_LEFT_TOP = 11
/**广告双倍奖励 */
export const EVENT_AD_2REWARD = 12
/**战斗中广告复活成员 */
export const EVENT_AD_REBORN_BATTLE = 13
/**地图中广告复活成员 */
export const EVENT_AD_REBORN_WORLD = 14
/**打开全体成员阵亡界面 */
export const EVENT_OPEN_ALL_DIE_PANEL = 15
/**战斗新一回合 */
export const EVENT_BATTLE_NEW_TURN = 16
/**进入隐身状态 */
export const EVENT_STEALTH = 17
/**施展缩地术 */
export const EVENT_FLASH = 18
/**广告解锁存档位 */
export const EVENT_AD_UNLOCK_RECORD = 19

/**陆地1，在遇到高低相对地形时可配合陆地2使用，通过台阶切换地形 */
export const TILE_LAND1 = 993
/**陆地2 */
export const TILE_LAND2 = 994
/**树林或床头。人物形象只显示半身 */
export const TILE_TREES = 995
/**山洞中的水潭 */
export const TILE_WATER = 996
/**大海，身上带有船时可以在上面移动，需要台阶切换回大陆地形 */
export const TILE_SEA = 997
/**台阶，通过台阶可以从一个地形走到另一个地形 */
export const TILE_STEPS = 998
/**桥，洞穴中跨过水的地形。当主角是半身形象时会遮挡主角 */
export const TILE_BRIDGE = 999
/**遮挡物，遮挡角色 */
export const TILE_COVER = 1000



