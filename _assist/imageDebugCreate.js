let fs = require('fs')
let path = require('path')

let dirs = fs.readdirSync(path.resolve(__dirname, './images/'))

let assets = dirs.filter(n => n != 'avatar').join(',')

let debugPath = path.resolve(__dirname, './imageDebug.ts')
let debugFile = fs.readFileSync(debugPath, 'utf8')

debugFile = debugFile.replace(/'.*';/, `'${assets}';`)

fs.writeFileSync(debugPath, debugFile)
