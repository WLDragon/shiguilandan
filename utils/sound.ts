import pako from "pako"

class AudioController {
  context: AudioContext

  musicGain: GainNode
  music: AudioBufferSourceNode
  musicBuffer: AudioBuffer
  musicVolume: number

  isRunning: boolean = false
  /**播放前先判断，避免一些延时函数在游戏进入后台后还播放声音 */
  isFreeze: boolean = false

  constructor() {
    this.context = new AudioContext
  }

  playMusic(buff: AudioBuffer, volume: number = 1) {
    this.musicBuffer = buff
    this.musicVolume = volume

    if (!this.isFreeze && this.isRunning) {
      if (!this.musicGain) {
        this.musicGain = this.context.createGain()
        //设置背景音乐音量只有50%
        this.musicGain.connect(this.context.destination)
      }
      this.musicGain.gain.value = volume

      let source = this.context.createBufferSource()
      source.connect(this.musicGain)
      source.buffer = buff
      source.loop = true
      source.start()

      this.music = source
    }
  }

  playSound(buff: AudioBuffer) {
    if (!this.isFreeze && this.isRunning) {
      //音效
      let source = this.context.createBufferSource()
      source.buffer = buff
      source.connect(this.context.destination)
      source.start()
    }
  }

  resume() {
    return new Promise<void>(resolve => {
      if (this.context.state == 'suspended') {
        this.context.resume().then(() => {
          this.isRunning = true
          if (this.musicBuffer && !this.music) {
            this.playMusic(this.musicBuffer, this.musicVolume)
          }
          resolve()
        })

      } else {
        this.isRunning = true
        resolve()
      }
    })
  }

  pause() {
    return new Promise<void>(resolve => {
      if (this.context.state == 'running') {
        this.context.suspend().then(() => {
          this.isRunning = false
          resolve()
        })
      } else {
        this.isRunning = false
        resolve()
      }
    })
  }

  /**
   * 系统退到后台时需要冻结播放器，不然会出错
   * @param value 是否冻结播放器
   */
  freeze(value: boolean) {
    this.isFreeze = value
    if (value && this.isRunning) {
      if (this.context.state == 'running') {
        this.context.suspend()
      }
    }

    if (!value && this.isRunning) {
      if (this.context.state == 'suspended') {
        this.context.resume()
      }
    }
  }
}


const soundController = new AudioController()
const musicController = new AudioController()

const AUDIO_CACHE: { [x: string]: AudioBuffer } = {}

function cacheData(data: Uint8Array) {
  let n = data[0]
  let nameChars = data.slice(1, n + 1)
  let name = String.fromCharCode(...nameChars)
  let u8 = data.slice(n + 1)
  soundController.context.decodeAudioData(u8.buffer,
    buffer => {
      AUDIO_CACHE[name] = buffer
    }, err => { console.error(err) })
}

export function registerAudio(buffer: ArrayBuffer) {
  let data = pako.inflateRaw(new Uint8Array(buffer))
  let len = data.byteLength
  let pointer = 0
  let content = new Uint8Array(data)
  while (pointer < len) {
    let high = content[pointer]
    let midle = content[pointer + 1]
    let low = content[pointer + 2]
    let n = (high << 16) | (midle << 8) | low

    let begin = pointer + 3
    let end = begin + n
    let b = content.slice(begin, end)
    cacheData(b)
    pointer = end
  }
}

export function freezeAudio(value: boolean) {
  soundController.freeze(value)
  musicController.freeze(value)
}

export function playSound(name: string) {
  if (AUDIO_CACHE[name]) {
    soundController.playSound(AUDIO_CACHE[name])

  } else {
    console.warn(`no sound: ${name}`)
  }
}

export function playMusic(name: string, volume: number = 1) {
  if (musicController.music) {
    musicController.music.stop()
    musicController.music.disconnect()
    musicController.music = null
  }

  if (AUDIO_CACHE[name]) {
    musicController.playMusic(AUDIO_CACHE[name], volume)

  } else {
    musicController.musicBuffer = null
  }
}

/**
 * 音效开关
 * @param value 是否开启音效
 */
export function toggleSound(value: boolean) {
  if (value) {
    return soundController.resume()
  } else {
    return soundController.pause()
  }
}

/**
 * 音乐开关
 * @param value 是否开启音乐
 */
export function toggleMusic(value: boolean) {
  if (value) {
    return musicController.resume()
  } else {
    return musicController.pause()
  }
}