const { app, BrowserWindow, session, desktopCapturer } = require('electron')
const path = require('path')

let win

app.whenReady().then(() => {
  createWindow()
  // doubleWindow()
  // simpleSession()
  // testSession()
})

async function createWindow() {
  // win.loadURL('https://www.ip138.com')
  // win.loadFile(path.join(__dirname, '../renderer/index.html'))

  // const newSession = session.fromPartition('new', { cache: false })
  // console.log(newSession.getStoragePath())

  // const newSession = session.fromPartition('new', { cache: true })
  // console.log(newSession.getStoragePath()) // null

  // const newSession = session.fromPartition('persist:new', { cache: false })
  // console.log(newSession.getStoragePath()) // ~/Library/Application Support/electron-desktop/Partitions/new

  const newSession = session.fromPartition('persist:new', { cache: true })
  console.log('getCacheSize', await newSession.getCacheSize())
  await newSession.clearCache()

  console.log('getCacheSize', await newSession.getCacheSize())
  console.log(newSession.getStoragePath()) // ~/Library/Application Support/electron-desktop/Partitions/new

  setTimeout(() => {
    newSession.flushStorageData()
  }, 3000)
  setTimeout(async () => {
    console.log('getCacheSize', await newSession.getCacheSize())
  }, 5000)

  return
  win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      session: newSession,
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })
  // win = new BrowserWindow({ width: 400, height: 300, webPreferences: { partition: 'new' } })
  win.loadURL('https://www.baidu.com')
  win.webContents.openDevTools({ mode: 'detach' })
  return

  // console.log(session.defaultSession === win.webContents.session)
  // console.log(session.defaultSession.isPersistent()) // true
  // console.log(win.webContents.session === newSession)

  const preloads = newSession.getPreloads()
  console.log(preloads)
  newSession.setPreloads([path.join(__dirname, '../preload/p1.js'), path.join(__dirname, '../preload/p2.js')])
  console.log(newSession.getPreloads())

  // setTimeout(() => {
  //   const arr =
  // }, 3000)

  // console.log(await win.webContents.session.getCacheSize())
  // setTimeout(async () => {
  //   console.log(await win.webContents.session.getCacheSize())
  // }, 5000)

  // ss.setProxy({
  //   proxyRules: 'socks5://127.0.0.1:13659',
  // })
  // ss.resolveProxy('https://www.baidu.com').then((info) => console.log(info))
  // setTimeout(() => {
  //   ss.resolveProxy('https://www.baidu.com').then((info) => console.log(info))
  // }, 5000)

  // session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
  //   desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
  //     // Grant access to the first screen found.
  //     callback({ video: sources[0] })
  //   })
  // })
}

// const wins = []
function doubleWindow() {
  const win1 = new BrowserWindow({ width: 400, height: 300 })
  win1.loadURL('https://www.baidu.com')

  const win2 = new BrowserWindow({ width: 400, height: 300 })
  win2.loadURL('https://www.sogou.com')

  console.log(win1.webContents.session === win2.webContents.session) // true

  // win.webContents.openDevTools({ mode: 'detach' })
}

function simpleSession() {
  console.log(session)
  const s = session.defaultSession
  const s1 = session.fromPartition('hello', { cache: false })
  const s2 = session.fromPartition('world')
  const s3 = session.fromPartition('hello', { cache: true })

  console.log(s1 === s2)
  console.log(s1 === s3)
  console.log(s === s1)

  const ses = session.fromPartition('persist:name')
  console.log(ses.getUserAgent())
}

async function testSession() {
  const ss = win.webContents.session
  // 页面缓存相关
  // console.log('getCacheSize', await ss.getCacheSize())
  // await ss.clearCache()
  // console.log('getCacheSize', await ss.getCacheSize())

  console.log('isPersistent', ss.isPersistent())
  console.log('getStoragePath', ss.getStoragePath())

  win.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    console.log('item', item)
    // item.setSavePath('/tmp/save.pdf')
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })

  // setTimeout(() => {
  //   ss.downloadURL('https://img.zlib.cn/blog/script.jpg')
  // }, 2000)
}

function cookieApi() {
  const { cookies } = session.defaultSession
  cookies
    .get({})
    .then((cookies) => {
      // console.log('all cookies', cookies)
      console.log('json', JSON.parse(JSON.stringify(cookies)))
    })
    .catch((error) => {
      console.log(error)
    })

  // cookies
  //   .get({ url: 'http://www.github.com' })
  //   .then((cookies) => {
  //     console.log('github cookies', cookies)
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })

  // cookies
  //   .set({ url: 'http://www.github.com', name: 'dummy_name', value: 'dummy' })
  //   .then(() => {
  //     console.log('set cookie')
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
  //   .finally(() => {
  //     cookies.flushStore()
  //   })
}
