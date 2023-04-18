///全局消息发射器

const $once = '$once'
let messageCenter: Function[] = []

/**
 * 监听消息
 * @param message 消息
 * @param handle 处理消息的函数
 */
export function on(message: number, handle: Function) {
  if (!messageCenter[message]) {
    messageCenter[message] = handle

  } else {
    throw Error(`message=${message} has on!`)
  }
}

/**
 * 发送消息
 * @param message 消息
 * @param args 附带的参数列表
 */
export function emit(message: number, ...args: any[]) {
  let h = messageCenter[message]
  if (h) {
    //异步消息
    requestAnimationFrame(() => {
      h(...args)
      if (h[$once]) {
        off(message)
        h[$once] = false
      }
    })

  } else {
    console.warn('no message=' + message)
  }
}

/**
 * 关闭对消息的监听
 * @param message 消息
 * @param handle 处理消息的函数
 */
export function off(message: number) {
  messageCenter[message] = null
}

/**
 * 监听一次性消息，接收后自动关闭监听
 * @param message 消息
 * @param handle 处理消息的函数
 */
export function once(message: number, handle: Function) {
  on(message, handle)
  handle[$once] = true
}