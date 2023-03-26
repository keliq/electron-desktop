const { app, ipcMain, BrowserWindow, webContents, webFrameMain } = require('electron')
const path = require('path')

let win

app.whenReady().then(() => {
  createWindow()
  addListener()
})

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      webviewTag: true,
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
}

function addListener() {
  // 按照下面的顺序，获取消息
  win.webContents.on('ipc-message', (event, channel, ...args) => {
    console.log('1.webContents ipc-message', channel, args)
  })
  win.webContents.mainFrame.ipc.on('channel-name', (event, ...args) => {
    console.log('2.webContents mainFrame channel', args)
  })
  win.webContents.ipc.on('channel-name', (event, ...args) => {
    console.log('3.webContents channel', args)
  })
  ipcMain.on('channel-name', (event, ...args) => {
    console.log('4.ipcMain channel', args)
  })

  console.log('webContents', webContents)
  console.log(webContents.create.toString())
  // console.log(webContents.create())
  // console.log(win.webContents)
  console.log(webContents.fromId.toString())
  // console.log(win.webContents.getAllWebContents())

  // console.log(webContents.getAllWebContents())

  console.log('webFrameMain', webFrameMain)

  setTimeout(() => {
    console.log(win.webContents.mainFrame.framesInSubtree)
  }, 3000)
  win.webContents.on('did-finish-load', (event) => {
    console.log('did-finish-load')
  })

  // send 和 sendSync 走的是同一个通道
  // ipcMain.on('channel-name', (event, ...args) => {
  //   console.log('4main receive sync', args)
  //   // event.returnValue = 'ok' // 同步的
  //   // event.reply()
  //   setTimeout(() => {
  //     event.reply('channel-name', { today: 'nice' })
  //     // event.returnValue = { good: 'ok' } // 也是同步的，阻塞
  //   }, 3000)
  // })

  // 按照下面的顺序来进行，如果进入到其中一个，那么后面的就不会进入了
  // win.webContents.mainFrame.ipc.handle('channel-name', (event, ...args) => {
  //   console.log('1webContents mainFrame handle', args)
  // })
  // win.webContents.ipc.handle('channel-name', (event, ...args) => {
  //   console.log('2webContents ipc handle', args)
  // })
  // 这边没有一个 hook 能拿到所有的 invoke 和 handle 消息
  ipcMain.handle('channel-name', async (event, ...args) => {
    console.log('3main receive handle', args)
    await sleep(3000)
    return { handle: 'invoke' }
  })

  // console.log('focused webcontents', webContents.getFocusedWebContents())
  // setTimeout(() => {
  //   console.log('focused webcontents2', webContents.getFocusedWebContents())
  // }, 3000)
  // win.webContents.on('ipc-message-sync', (event, channel, ...args) => {
  //   console.log('webContents ipc-message-sync', channel, args)
  // })
  // win.webContents.on('ipc-message-sync', (event, channel, ...args) => {
  //   console.log('webContents mainFrame ipc-message-sync', channel, args)
  // })
}

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
