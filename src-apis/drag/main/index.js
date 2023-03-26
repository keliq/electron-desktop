const { app,BrowserWindow } = require('electron')
const path = require('path')

// drag 区域设置 cursor pointer 是不起作用的
app.whenReady().then(() => {
  createWindow()
})

let win
function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
}