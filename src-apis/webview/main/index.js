const { app, webContents, BrowserWindow, webFrameMain } = require('electron')
const path = require('path')
const url = require('url')

let win
app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'detach' })
  setTimeout(printFrames, 2000)
})


function printFrames() {
  const frames = win.webContents.mainFrame.framesInSubtree
  const print = (frame) => frame && frame.url && path.basename(frame.url)
  frames.forEach((it) => {
    console.log(`current frame: ${print(it)}`)
    console.log(`   children: ${JSON.stringify(it.frames.map((it) => print(it)))}`)
    console.log(`   parent`, print(it.parent), '\n')
  })
}

function test() {
  setTimeout(() => {
    // console.log(webContents.getAllWebContents())
    // console.log(webContents.mainFrame)
    const allWebContents = webContents.getAllWebContents()
    console.log('allWebContents', allWebContents.length)
    allWebContents.forEach((it, i) => {
      console.log(i, it === win.webContents)
      if (it !== win.webContents) {
        setHandler(it)
      }
      console.log('mainFrame', it.mainFrame)
      console.log('mainFrame direct descendents', it.mainFrame.frames)
      console.log('mainFrame tree', it.mainFrame.framesInSubtree)
    })
  }, 2000)
}

function setHandler(wc) {
  wc.setWindowOpenHandler(({ url }) => {
    console.log('url', url)
    //
    if (url.includes('baidu.com')) {
      return {
        action: 'allow',
        outlivesOpener: true,
        overrideBrowserWindowOptions: {
          // frame: false,
          // fullscreenable: false,
          // backgroundColor: 'black',
          webPreferences: {
            // preload: 'my-child-window-preload-script.js',
          },
        },
      }
    }
    return { action: 'deny' }
  })
}
