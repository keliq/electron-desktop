const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = 'https://www.baidu.com'

let win

// setTimeout(() => {
//   win.webContents.openDevTools({ mode: 'detach' })
// }, 5000)

app.whenReady().then(() => {
  // normal()
  // frameless()
  // modal()
  // kiosk()
  // modalWin()
  // parentChild()
  // createAndDestroy(0)
  // createAndDestroy(1)
  // contextIsolation()
})

// 设置几种标题栏的样式
function normal() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadURL(url)
}

function withoutTitleBar() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    titleBarStyle: 'hiddenInset', // 好几个取值
  })
  win.loadURL(url)
}

// 设置无边框窗口
function frameless() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    // resizable: false,
    frame: false,
    // transparent: true,
  })
  win.loadURL(url)
}

// 设置父子窗口和模态窗口，注意模态窗口必须同时设置 parent 和 modal 属性才行
function modalWin() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadURL(url)
  const modal = new BrowserWindow({
    width: 300,
    height: 200,
    parent: win,
    modal: true,
  })
  modal.loadURL(url)
  setTimeout(() => {
    modal.close()
  }, 3000)
}

function parentChild() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadURL(url)
  const child = new BrowserWindow({
    width: 300,
    height: 200,
    parent: win,
  })
  child.loadURL(url)
}

function kiosk() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    kiosk: true,
  })
  setTimeout(() => {
    win.setKiosk(false)
  }, 5000)
}

// 创建并销毁窗口
function createAndDestroy(flag) {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })
  win.loadURL(url)
  if (flag) {
    setTimeout(() => {
      console.log('destroy', flag)
      win.destroy()
    }, 5000)
  }
}

function contextIsolation() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
  // contextIsolation2()
}

function contextIsolation2() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, '../preload/index.js'),
      // sandbox: false,
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
}

