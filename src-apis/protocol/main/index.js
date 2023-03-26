const { app, protocol, BrowserWindow, session } = require('electron')
const path = require('path')
const url = require('url')
const https = require('https')
const fs = require('fs')

let win, mainSession

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'hello',
    privileges: {
      standard: true
    },
  },
])

app.whenReady().then(() => {
  console.log('ready', protocol.getStandardSchemes())
  mainSession = session.fromPartition('main')
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // session: mainSession,
      // partition: 'name',
    },
  })
  // win.loadURL('https://www.baidu.com')
  // win.loadURL('http://localhost:3030')
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.openDevTools({ mode: 'bottom' })
  // interceptFileProtocol()
  // interceptHttpsProtocol()
  // interceptBufferProtocol()
  // interceptStringProtocol()
  interceptHttpProtocol()

  // console.log('session protocol', protocol, session.defaultSession.protocol)
  // registerFileProtocol()
})

const redDot =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='

function interceptStringProtocol() {
  // protocol.interceptStringProtocol('http', (request, callback) => {
  //   console.log('protocol.interceptStringProtocol', request)
  //   if (request.url.includes('3030')) {
  //     callback({
  //       mimeType: 'text/html',
  //       data: '<h1>This is a perfectly cromulent response.</h1>',
  //     })
  //   } else {
  //     callback({
  //       url: 'http://localhost:4040',
  //       method: 'GET',
  //       data: 'asdfasdf',
  //     })
  //   }
  // })
  // protocol.interceptStringProtocol('hello', (request, callback) => {
  //   console.log('protocol.interceptStringProtocol', request)
  //   const buffer = fs.readFileSync(path.join(__dirname, 'banana.jpg'))
  //   callback({
  //     // mimeType: 'image/png',
  //     // data: redDot,
  //     data: buffer,
  //     // data: path.join(process.cwd(), 'public/img/pineapple.png'),
  //   })
  // })

  console.log('Intercepted before', protocol.isProtocolIntercepted('data'))
  console.log('Registered before', protocol.isProtocolRegistered('data'))

  // dada 这种形式是拦截不到的，不知道为什么，本身 data 也是 scheme 呀，应该是 img 标签内部自己处理了，没有走资源获取的方式
  // 所以 data 这种 scheme 是比较特殊的，标签自己处理掉了
  // protocol.interceptStringProtocol('data', (request, callback) => {
  //   console.log('protocol.interceptStringProtocol', request)
  //   // 这个为什么拦截不到呢？
  //   callback({
  //     data: 'abcd',
  //   })
  // })

  protocol.interceptStringProtocol('http', (request, callback) => {
    console.log('protocol.interceptStringProtocol', request)
    // 这个为什么拦截不到呢？
    callback({
      mimeType: 'application/json',
      data: JSON.stringify({ name: 'keliq' }),
    })
  })

  console.log('Intercepted after', protocol.isProtocolIntercepted('data'))
  console.log('Registered after', protocol.isProtocolRegistered('data'))

  // protocol.interceptFileProtocol('hello', (request, callback) => {
  //   console.log('protocol.interceptStringProtocol', request)
  //   callback(path.join(process.cwd(), 'public/img/banana.jpg'))
  // })

  // protocol.interceptBufferProtocol('hello', (request, callback) => {
  //   console.log('protocol.interceptBufferProtocol', request)
  //   // callback(path.join(process.cwd(), 'public/img/banana.jpg'))
  //   const buffer = fs.readFileSync(path.join(process.cwd(), 'public/img/banana.jpg'))
  //   callback({
  //     // mimeType: 'image/png',
  //     data: buffer
  //    })
  // })

  // protocol.interceptStreamProtocol('hello', (request, callback) => {
  //   console.log('protocol.interceptStreamProtocol', request)
  //   // callback(path.join(__dirname, 'img/banana.jpg'))
  //   const stream = fs.createReadStream(path.join(__dirname, 'img/banana.jpg'))
  //   callback({
  //     data: stream
  //    })
  // })
}

function interceptBufferProtocol() {
  protocol.interceptBufferProtocol('http', (request, callback) => {
    console.log('protocol.interceptBufferProtocol', request)
  })
}

function interceptFileProtocol() {
  const fileProtocol = protocol.interceptFileProtocol('file', (request, callback) => {
    console.log('protocol.interceptFileProtocol', request)

    // 文件缓存
    /**
     * 处理 <img src="./img/banana.jpg" /> 中的本地资源
     * 提取路径，映射到 https://img.zlib.cn/banana.jpg
     * 文件存在则使用，否则下载到本地
     */
    if (request.url.includes('img/')) {
      const filename = request.url.split('/').pop()
      const filePath = path.join(__dirname, 'img', filename)
      if (fs.existsSync(filePath)) return callback(filePath)
      const file = fs.createWriteStream(filePath)
      const fileURL = 'https://img.zlib.cn/' + filename
      console.log({ fileURL, filename })
      https.get(fileURL, (res) => {
        res.pipe(file)
        file.on('finish', () => {
          // file.close(cb)
          console.log('finish')
          callback(filePath)
        })
      })
    } else {
      const filePath = url.fileURLToPath(request.url)
      console.log('filePath', filePath)
      callback(filePath)
    }

    return
    // 注意，如果这里的 url 不是本地路径，那么就会报错，例如
    // TypeError [ERR_INVALID_FILE_URL_HOST]: File URL host must be "localhost" or empty on darwin
    // at getPathFromURLPosix (internal/url.js:1330:11)
    // at Object.fileURLToPath (internal/url.js:1353:50)
    // at Function.eval (webpack-internal:///./src/electron-natives/protocol.ts:14:75) {
    //   code: 'ERR_INVALID_FILE_URL_HOST'
    // }
    try {
      // 注意，query 参数没了
      const filePath = url.fileURLToPath(request.url)
      let newFilePath = filePath
      if (filePath.includes('lib/img')) {
        const { dir, base, ext, name } = path.parse(filePath)
        if (ext === '.png') {
          newFilePath = path.join(process.cwd(), 'public/img/pineapple.png') // query 怎么处理呢？？？
          console.log('callback error')
          callback({ error: -1, path: '/emtpy' })
          return
        }
      }
      // 注意，如果有 ？ 参数的话，如果用 slice 来处理字符串，会影响到资源解析的，这是个坑
      console.log('newFilePath', newFilePath)
      // callback({
      //   path: newFilePath,
      // })
      // 看看这样写
      callback(newFilePath)
    } catch (e) {
      callback({ error: -2 })
      // console.error(e)
    }
  })
  console.log('intercept result', fileProtocol)
}

function interceptHttpProtocol() {
  // protocol.interceptHttpProtocol('https', (request, callback) => {
  //   console.log('interceptHttpProtocol', request)
  //   callback({
  //     // url: request.url,
  //     url: 'http://localhost:3030/',
  //     method: request.method,
  //     mimeType: 'text/html', // 这里设置这个是没用的
  //   })
  // })

  protocol.interceptHttpProtocol('file', (request, callback) => {
    const path = request.url.replace(/file:\/*api\//, '')
    callback({
      url: `http://localhost:3030/api/${path}`,
      method: 'GET',
    })
  })
  console.log('interceptHttpProtocol', request)
}
function interceptHttpsProtocol() {
  // 可能会出现无限循环
  // 上面的例子，能让拦截器 callback 的时候，不再被自己拦截。session:null 可以是自己再弄一个 session，这里简单的设置为 null 也是可以的。
  // 可以用 Session 实现每次拦截的请求通转移到另外一个 Session 。也就是拦截器只能拦截 default Session。
  const success = win.webContents.session.protocol.interceptHttpProtocol('http', (request, callback) => {
    console.log('protocol.interceptHttpProtocol', request)
    // callback({
    //   url: request.url,
    //   method: request.method,
    //   session: null,
    //   headers: { ok: 1 },
    // })
    // if (request.url === 'http://localhost:3030/') {
    //   callback({
    //     url: 'http://localhost:4040/',
    //     method: request.method,
    //     session: null,
    //   })
    // } else {
    //   callback({
    //     url: request.url,
    //     method: request.method,
    //     session: null,
    //   })
    // }
    const url = new URL(request.url)
    url.searchParams.append('name', 'keliq')
    callback({
      url: url.toString(),
      method: request.method,
      session: null,
    })
  })
  console.log('intercept http result', success)
}

function registerFileProtocol() {
  protocol.registerFileProtocol('hello', (request, callback) => {
    console.log('hello', request)
    const relativePath = request.url.replace(/^hello:\/*?/, '').replace(/\/?\?.*/, '')
    const filePath = path.join(__dirname, '../renderer', relativePath)
    console.log('filePath', filePath)
    callback({ path: filePath, headers: { Accept: 'text/html' } })
  })
  // 缓存
  // protocol.registerFileProtocol('cached', (request, callback) => {
  //   if (request.url.includes('img/')) {
  //     const filename = request.url.split('/').pop()
  //     const filePath = path.join(__dirname, 'img', filename)
  //     if (fs.existsSync(filePath)) return callback(filePath)
  //     const file = fs.createWriteStream(filePath)
  //     const fileURL = 'https://img.zlib.cn/' + filename
  //     https.get(fileURL, (res) => {
  //       res.pipe(file)
  //       file.on('finish', () => callback(filePath))
  //     })
  //   } else {
  //     const filePath = url.fileURLToPath(request.url)
  //     console.log('filePath', filePath)
  //     callback(filePath)
  //   }
  // })

  // protocol.registerFileProtocol('hello', (request, callback) => {
  //   console.log('hello', request)
  //   // const [,fileName] =
  //   // 只有设置了 privileges 为 standard 才能取得相对路径
  //   callback(path.join(__dirname, '../renderer', 'embed.html'))
  // })
}
