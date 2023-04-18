import { Dot } from '../../model/notype/Dot';

type MapDataObjectProperty = {
  property: {
    $: { name: string, value: string }
  }[]
}

type MapDataObject = {
  $: { id: number, x: number, y: number, width?: number, height?: number, template: string },
  properties?: MapDataObjectProperty[]
}

export type MapData = {
  map: {
    $: { width: number, height: number },
    properties: MapDataObjectProperty[]
    layer: {
      data: { _: string }[]
    }[],
    objectgroup?: {
      object: MapDataObject[]
    }[]
  }
}

function applyProperties(dot: Object, properties: MapDataObjectProperty[], keepType = false) {
  properties[0].property.forEach(p => {
    let n = p.$.name
    let a = n.split('_')
    let a0 = a[0]
    let a1 = a[1]
    let v = p.$.value
    let k = keepType ? n : a0

    if (a1 == 's') {
      dot[k] = v

    } else if (a1 == 'a') {
      dot[k] = JSON.parse(v)

    } else {
      dot[k] = Number(v)
    }
  })
}

/**序号+1与类型对应 */
const TYPE_NAMES = [
  '传送',
  '障碍',
  '宝箱',
  '阶梯',
  '开关',
  '大风',
  '路人',
  '大牛',
  '义工',
  '商店',
  '医生',
  '道士',
  '英雄',
  '客栈',
  '妖兽区域',
]

export function paserMapData2SceneObjects(name: string, data: MapData) {

  if (!data.map.layer[1]) {
    console.warn(`地图【${name}】没设置通路`);
  }

  let result = {
    scene: [{
      name_s: name,
      width_16: Number(data.map.$.width),
      height_16: Number(data.map.$.height),
      map_s: data.map.layer[0].data[0]._,
      terrain_s: data.map.layer[1] ? data.map.layer[1].data[0]._ : '',
      type_8: 0,
      tile_16: 0,
      dotsJson_s: ''
    }]
  }

  if (data.map.properties) {
    applyProperties(result.scene[0], data.map.properties, true)
  } else {
    throw Error('missing type_8 & tile_16 in Map Data!')
  }

  let dots: Dot[] = []

  if (data.map.objectgroup && data.map.objectgroup.length && data.map.objectgroup[0].object) {
    data.map.objectgroup[0].object.forEach(o => {
      let dot = new Dot
      dot.id = Number(o.$.id)
      dot.x = Number(o.$.x) / 32
      dot.y = Number(o.$.y) / 32
      if (o.$.width) {
        dot['w'] = Number(o.$.width) / 32
        dot['h'] = Number(o.$.height) / 32
      }

      if (o.properties && o.properties.length) {
        applyProperties(dot, o.properties)
      }

      TYPE_NAMES.some((n, i) => {
        if (o.$.template.includes(n)) {
          dot.type = i + 1
          return true
        }
      })

      dots.push(dot)
    })
  }

  result.scene[0].dotsJson_s = JSON.stringify(dots)
  return result
}