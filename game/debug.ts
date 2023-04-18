export function virtualAndroid() {
  window['Android'] = {
    openUrl(url: string) {
      window.open(url, '_blank')
    },
    login() {
      window['login']()
    },
    showAd(type: string) {
      window['addReward'](type)
    },
    writeData(fileName: string, data: string) {
      localStorage.setItem(fileName, data)
    },
    readData(fileName: string): string {
      return localStorage.getItem(fileName)
    },
    deleteData(fileName: string) {
      localStorage.removeItem(fileName)
    },
  }
}
