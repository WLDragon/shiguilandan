//接收原生系统发送过来的消息
import { WINDOW, EVENT_AD_2REWARD, EVENT_AD_REBORN_BATTLE, EVENT_AD_REBORN_WORLD, EVENT_AD_UNLOCK_RECORD } from '../game/constant';
import { emit } from '../utils/emitter';
import { freezeAudio } from '../utils/sound';
import { tempData } from '../game/dataTemp';

WINDOW['addReward'] = function addReward(type: string) {
  if (type == 'reward2') {
    emit(EVENT_AD_2REWARD)

  } else if (type == 'reborn') {
    emit(EVENT_AD_REBORN_BATTLE)

  } else if (type.includes('reborn_')) {
    emit(EVENT_AD_REBORN_WORLD, Number(type.split('_')[1]))

  } else if (type.includes('record_')) {
    emit(EVENT_AD_UNLOCK_RECORD, Number(type.split('_')[1]))
  }
}

WINDOW['login'] = function login() {
  tempData.isLogin = true
}

WINDOW['disableAudio'] = function disableAudio(value: boolean) {
  freezeAudio(value)
}
