const { app, BrowserWindow, BrowserView, webContents, ipcMain } = require('electron')
const path = require('path')

const winMap = {}
app.whenReady().then(() => {
  createWindow()
  /** 跨窗口通信
  createWin('win1', 'win2')
  createWin('win2', 'win1')
  ipcMain.on('communicate', (event, { from, to, msg }) => {
    winMap[to].webContents.send('communicate', { from, to, msg })
  })
  */
  // windowHandler()
  // inject()
  // listenEvents()
})

let win
function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: { webviewTag: true },
  })
  // console.log(win.webContents)
  // win.loadURL('https://www.baidu.com')
  // win.webContents.loadURL('https://www.baidu.com')
  win.webContents.loadFile(path.join(__dirname, '../renderer/index.html'))
  // win.loadFile(path.join(__dirname, '../renderer/index.html'))
  // setTimeout(printFrames, 2000)
  console.log(' win.toggleDevTools', win.webContents.toggleDevTools)
  win.webContents.toggleDevTools({ mode: 'bottom' })
  setTimeout(() => {
    console.log('setUserAgent')
    console.log(win.webContents.getUserAgent())
    win.webContents.setUserAgent('xxxxxx')
    // win.webContents.downloadURL('https://img.zlib.cn/blog/script.jpg')
    // win.webContents.selectAll()
    win.webContents.capturePage().then((image) => {
      console.log('image', image)
    })
  }, 5000)
}

function createWin(from, to) {
  const preload = path.join(__dirname, '../preload/index.js')
  const html = path.join(__dirname, '../renderer/communicate.html')
  const win = new BrowserWindow({ width: 600, height: 500, webPreferences: { preload } })
  // win.loadFile(html, { query: { from, to } }) // 正确
  // win.loadURL('file://' + html + `?from=${from}&to=${to}`) // 正确
  win.loadFile(html + `?from=${from}&to=${to}`) // 错误
  win.webContents.toggleDevTools({ mode: 'bottom' })
  winMap[from] = win
}

// 可以决定是否弹出新窗口的
function windowHandler() {
  win = new BrowserWindow({ width: 800, height: 600 })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log('url', url)
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

async function inject() {
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  // win.webContents.openDevTools({ mode: 'bottom' })

  // 执行 JS 代码
  const js = `console.log('executeJavaScript');[1,2,3].pop();`
  const p = win.webContents.executeJavaScript(js)
  p.then((result) => console.log(result)).catch((e) => console.log('js执行出错', e))

  // 动态加载 CSS
  const css = `body { background-color: pink; }`
  const key = await win.webContents.insertCSS(css)
  setTimeout(() => {
    win.webContents.removeInsertedCSS(key)
  }, 3000)
}

function listenEvents() {
  win.loadFile(path.join(__dirname, '../renderer/index.html'))

  // 这是 electron 22 新增的方法，难怪没用...
  // win.webContents.on('input-event', (event, inputEvent) => {
  //   console.log('input-event', inputEvent)
  // })

  // setTimeout(() => {
  //   console.log('sendInputEvent')
  //   win.webContents.sendInputEvent({ type: 'keyUp', keyCode: '' })
  // }, 3000)

  win.webContents.on('before-input-event', (event, input) => {
    console.log('before-input-event', input)
  })
}

function findInPage() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: { preload: path.join(__dirname, '../preload/index.js') },
  })
  win.webContents.openDevTools({ mode: 'bottom' })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.on('found-in-page', (event, result) => {
    console.log('found-in-page', result)
    // if (result.finalUpdate) win.webContents.stopFindInPage('clearSelection')
  })

  bv = new BrowserView({})
  bv.webContents.loadFile(path.join(__dirname, '../renderer/search.html'))
  // bv.webContents.loadURL('https://www.baidu.com')
  win.setBrowserView(bv)
  // bv.webContents.openDevTools({ mode: 'detach' })

  const placeBrowserView = () => {
    return
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
    // bv.webContents.focus()
  }
  placeBrowserView()

  // 要么同比例放大缩小
  // bv.setAutoResize({
  //   horizontal: true,
  // })

  // 正在修改尺寸时触发
  win.on('resize', (event) => {
    console.log('resize')
    placeBrowserView()
  })

  // 完成修改尺寸时触发
  win.on('resized', (event) => {
    console.log('resized')
    // placeBrowserView()
  })

  let lastText = ''
  ipcMain.on('findInPage', (event, data) => {
    const { text = lastText, ...options } = data
    console.log('data', { text, options })
    lastText = text
    if (text) win.webContents.findInPage(text, options)
  })

  const findMatch = (findNext) => {
    console.log('type', win.webContents.getType())
    // console.log('findInPage', findNext)
    // win.webContents.findInPage('前往', { forward: true, findNext })
    setTimeout(() => {
      findMatch(true)
    }, 1000)
  }
  setTimeout(() => {
    findMatch(false)
  }, 1000)
}
