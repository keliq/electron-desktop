const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win

app.whenReady().then(() => {
  // createWindow()
  // createWithoutTitleBar()
  createCircleWindow()
})

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadFile(path.join(__dirname, '../renderer/clock.html'))
}

function createWithoutTitleBar() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    // titleBarStyle: 'hiddenInset',
    // frame: false,
    // transparent: true,
  })
  // win.loadURL('https://www.baidu.com')
  // win.loadURL('https://www.taobao.com')
  // win.loadURL('https://www.bing.com')
  win.loadURL('https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe_height_width')
  // win.loadFile(path.join(__dirname, '../renderer/clock.html'))
  win.webContents.openDevTools({ mode: 'detach' })
}

function createCircleWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })
  win.setIgnoreMouseEvents(true)
  win.loadFile(path.join(__dirname, '../renderer/clock.html'))
  ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
    console.log('set-ignore-mouse-events', args)
    BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(...args)
  })
  // win.webContents.openDevTools({ mode: 'detach' })
}
