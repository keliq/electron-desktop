// 注意 shell 模块在 sandbox 模式下渲染进程不可用
const { app, BrowserWindow, shell } = require('electron')


app.whenReady().then(() => {
  createWindow()
  shellApi()
})

let win
function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
}

function shellApi() {
  console.log('shell', shell)
  const file = '/Users/keliq/code/test.zip' // 文件的路径
  shell.beep() // 实测不起作用
  shell.showItemInFolder(file) // 有用
  shell.openPath(file) // 有用
}

// 主进程和渲染进程都能使用的API