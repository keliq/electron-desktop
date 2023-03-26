const { app, BrowserWindow, nativeImage, clipboard } = require('electron')
const path = require('path')

let win

app.whenReady().then(() => {
  // console.log(clipboard)
  const formats = clipboard.availableFormats()
  console.log(formats)
  // const result = clipboard.has('public/utf8-plain-text')
  // const result = clipboard.has('text/plain')
  // const result = clipboard.has('text')
  // const result = clipboard.read('public/utf8-plain-text')

  clipboard.writeText('写入文本')
  const result = clipboard.readText()

  // clipboard.writeHTML('<p style="color: red">红色</p>')
  // const result = clipboard.readHTML()

  // clipboard.writeImage(nativeImage.createFromPath(path.join(process.cwd(), 'apple.png')))
  // const result = clipboard.readImage()

  // clipboard.writeRTF('{\\rtf1\\ansi{\\fonttbl\\f0\\fswiss Helvetica;}\\f0\\pard\nThis is some {\\b bold} text.\\par\n}')
  // const result = clipboard.readRTF()
  console.log(result)
  clipboard.clear()

  win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false, // 如果开启了沙箱模式（默认开启），在 preload 中引用 clipboard 会报错
    },
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
})
