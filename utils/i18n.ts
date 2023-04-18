import Lang from "../model/Lang"

let i18nLocale = 'cn'
let i18nConfig: { [x: string]: any[] } = {}

export function initI18n(config: { [x: string]: any[] }) {
  i18nConfig = config
}

export function setI18nLocale(locale: string) {
  i18nLocale = locale
}

export function getI18nLocale(): string {
  return i18nLocale
}

/**获取多语言文本 */
export function $t(key: string, ...rest: string[]): string {
  let a = key.split('.')
  let scope: string = a[0]
  let id: number = Number(a[1])

  let table: Lang[] = i18nConfig[scope]
  if (!table) {
    console.error('didn\'t config lang: ' + scope)
    return ''
  }

  let row = table.find(r => r.id_16 == id)
  if (!row) {
    console.error('no lang id: ' + key)
    return ''
  }

  let result: string = (row[i18nLocale + '_s'] as string).replace(/\\n/g, '\n')

  if (rest.length) {
    //使用参数替换字符串中的{n}模板
    for (let i = 0; i < rest.length; i++) {
      result = result.replace('{' + i + '}', rest[i])
    }
  }

  return result
}
