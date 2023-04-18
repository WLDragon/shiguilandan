import { oxs } from 'oixi2';
import { Container } from 'pixi.js'

type ItemData = {
  /**子项的宽，包括间隔，用于计算下一个子项的水平位置，水平和网格排列必须 */
  width?: number,
  /**子项的高，包括间隔，用于计算下一个子项的垂直位置，垂直和网格排列必须 */
  height?: number,
  /**网格布局有多少列，网格布局必须 */
  column?: number
}

/**
 * 提供水平、垂直和网格排列方法的容器，子项宽高不一致可能会出现错位
 * 添加或删除子显示对象，需要手动调用排列方法
 * @param attributes 
 * @param options
 * @param slots 如果传入子显示对象列表，则需要提供options
 * @returns 
 */
export function AppContainer(attributes: string, options?: ItemData, slots?: Container[]) {
  return oxs(new XAppContainer(options), attributes, slots).build()
}

export class XAppContainer extends Container {
  options: ItemData

  constructor(options: ItemData) {
    super()
    this.options = options
  }

  build() {
    if (this.children.length) {
      if (this.options.column) {
        this.grid()

      } else if (this.options.width) {
        this.horizontal()

      } else if (this.options.height) {
        this.vertical()

      } else {
        throw Error('options missing!')
      }
    }
    return this
  }

  /**
   * 水平排列
   * @param width 如果没有传入options.width，则需要提供
   */
  horizontal(width?: number) {
    let w = width || this.options.width
    this.children.forEach((c, i) => {
      c.x = w * i
    })
  }

  /**
   * 垂直排列
   * @param height 如果没有传入options.height，则需要提供
   */
  vertical(height?: number) {
    let h = height || this.options.height
    this.children.forEach((c, i) => {
      c.y = h * i
    })
  }

  /**
   * 网格排列
   */
  grid(width?: number, height?: number, column?: number) {
    let w = width || this.options.width
    let h = height || this.options.height
    let n = column || this.options.column

    let row = -1
    this.children.forEach((c, i) => {
      let j = i % n
      if (j == 0) {
        row++
      }
      c.position.set(w * j, h * row)
    })
  }
}