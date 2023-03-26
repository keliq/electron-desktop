const { app, BrowserWindow } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  createWindow()
})

let win
function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'detach' })
}

function printFrames() {
  console.log('allWebContents length', webContents.getAllWebContents().length)
  const frames = win.webContents.mainFrame.framesInSubtree
  const print = (frame) => frame && frame.url && path.basename(frame.url)
  frames.forEach((it) => {
    console.log(`current frame: ${print(it)}`)
    console.log(`   children: ${JSON.stringify(it.frames.map((it) => print(it)))}`)
    console.log(`   parent`, print(it.parent), '\n')
    const wc = webContents.fromFrame(it)
    console.log('wc', wc === win.webContents)
    console.log('wc.hostWebContents', wc.hostWebContents === win.webContents)
  })
}
