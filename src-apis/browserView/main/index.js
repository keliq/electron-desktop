const { app, BrowserWindow, BrowserView } = require('electron')
const path = require('path')

let win, bv

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'detach' })
  createBrowserView()
})

function createBrowserView() {
  bv = new BrowserView({})
  bv.webContents.loadFile(path.join(__dirname, '../renderer/view.html'))
  win.setBrowserView(bv)
  const winSize = win.getSize()
  const winContentSize = win.getContentSize()
  console.log('size', { winSize, winContentSize })
  const viewWidth = 200
  const viewHeight = 200
  bv.setBounds({
    x: winSize[0] - viewWidth,
    y: winSize[1] - winContentSize[1],
    width: viewWidth,
    height: viewHeight,
  })
}
