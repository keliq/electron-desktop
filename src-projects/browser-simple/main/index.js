const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

app.whenReady().then(() => {
  createWindow()
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      webviewTag: true,
    },
  })
  mainWindow.loadURL('http://127.0.0.1:5173/')
  // mainWindow.loadFile(path.join(__dirname, './index.html'))
  mainWindow.webContents.openDevTools({ mode: 'bottom' })
}
