const { crashReporter, app, BrowserWindow } = require('electron')
const path = require('path')

// 只保存到本地
// crashReporter.start({ submitURL: '', uploadToServer: false })
// 上传到服务器
const notLongEnoughKey = new Array(39).fill('1').join('')
const longKey = new Array(40).fill('1').join('')

const notLongEnoughValue = new Array(20320).fill('1').join('')
const longValue = new Array(20321).fill('1').join('')

crashReporter.start({
  submitURL: 'http://30.197.128.166:3030/crashReport',
  extra: {
    userName: 'keliq',
    // [longKey]: 'longKey',
    // longValue,
  },
  globalExtra: {
    startAt: new Date().toLocaleString(),
    [longKey]: 'longKey',
    // longValue,
  },
  rateLimit: true,
})
console.log('getLastCrashReport', crashReporter.getLastCrashReport())
console.log('getUploadedReports', crashReporter.getUploadedReports())
console.log('getUploadToServer', crashReporter.getUploadToServer())

crashReporter.addExtraParameter('userAge', '18')
// crashReporter.addExtraParameter(notLongEnoughKey, 'notLongEnoughKey')
// crashReporter.addExtraParameter(longKey, 'longKey')

// crashReporter.addExtraParameter('notLongEnoughValue', notLongEnoughValue)
// crashReporter.addExtraParameter('longValue', longValue)

setTimeout(() => {
  // process.crash()
}, 5000)

let win

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
})
