const { app, BrowserWindow } = require('electron')

let mainWindow

const protocol = 'electron-desktop'
const scheme = `${protocol}://`
app.setAsDefaultProtocolClient(protocol)
app.disableHardwareAcceleration()

let urlParams = {}

handleSchemeWakeup(process.argv)

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    mainWindow.restore()
    mainWindow.show()
    handleSchemeWakeup(argv)
  })
}

app.on('open-url', (event, url) => handleSchemeWakeup(url))

app.whenReady().then(() => {
  createWindow()
  createWindow
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })
  mainWindow.loadURL('https://www.juejin.cn')
  // mainWindow.webContents.openDevTools({ mode: 'detach' })
}

function handleSchemeWakeup(argv) {
  const url = [].concat(argv).find((v) => v.startsWith(scheme))
  if (!url) return // 非 scheme 唤起
  const urlSearchParams = new URLSearchParams(url.slice(scheme.length))
  urlParams = Object.fromEntries(urlSearchParams.entries()) // 保存 scheme 参数
  if (app.isReady()) createWindow()
}
