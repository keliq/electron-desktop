const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

app.whenReady().then(() => {
  createWindow()
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      webviewTag: true,
     
    },
  })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.webContents.openDevTools({ mode: 'detach' })
}
