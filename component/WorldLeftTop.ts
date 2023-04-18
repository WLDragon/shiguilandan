import { ox } from 'oixi2';
import { Container, InteractionEvent } from 'pixi.js';
import { getHeros } from '../game/database';
import { WorldHeroItem, XWorldHeroItem } from './WorldHeroItem';
import { playSound } from '../utils/sound';

export function WorldLeftTop(attributes: string) {
  return ox(new XWorldLeftTop, attributes)
}

export class XWorldLeftTop extends Container {
  items: XWorldHeroItem[] = []

  update() {
    this.items.forEach(m => m.visible = false)
    getHeros().forEach((h, i) => {
      let m = this.items[i]
      if (!m) {
        m = WorldHeroItem(i)
        m.x = i * 44
        this.addChild(m)
        this.items.push(m)
        m.on('pointertap', this.onItemTap, this)
      }
      m.update(h)
      m.visible = true
    })
  }

  onItemTap(e: InteractionEvent) {
    playSound('tap_1')
    let m = e.target as XWorldHeroItem
    this.emit('hit', m.index)
  }
}