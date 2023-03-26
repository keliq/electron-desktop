const { app, BrowserWindow } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  createWindow()
})

let win
function createWindow() {
  win = new BrowserWindow({ width: 600, height: 400 })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  win.webContents.toggleDevTools({ mode: 'bottom' })
  // simpleCors()
  redirect()
}

function simpleCors() {
  win.loadURL('http://localhost:3020')
  return
  const filter = {
    urls: ['http://localhost:*/*'],
  }
  win.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
    const { responseHeaders } = details
    responseHeaders['Access-Control-Allow-Origin'] = ['*']
    callback({ responseHeaders })
  })
  // 'Access-Control-Allow-Headers': ['*'],
}

function redirect() {
  // win.webContents.session.webRequest.onBeforeRequest(
  //   {
  //     urls: ['http://localhost:3030/*'],
  //   },
  //   (details, callback) => {
  //     callback({ redirectURL: 'http://localhost:4040' })
  //   },
  // )

  win.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [],
    },
    (details, callback) => {
      const { url, resourceType } = details
      const response = { cancel: false }
      if (resourceType === 'xhr' && url.startsWith('http://localhost:3030')) {
        response.redirectURL = 'http://localhost:4040'
      }
      callback(response)
    },
  )
}

function webRequestApi() {
  // 最原始的写法
  session.defaultSession.webRequest.onBeforeRequest(
    {
      urls: ['http://localhost:3030/*'],
    },
    (details, callback) => {
      console.log('details', details)
      callback({ redirectURL: 'http://localhost:4040' })
    },
  )

  return
  // 更好的方式：
  session.defaultSession.webRequest.onBeforeRequest(
    {
      urls: [],
    },
    (details, callback) => {
      const { url, resourceType } = details
      const response = { cancel: false }
      if (resourceType === 'xhr' && url.startsWith('http://localhost:3030')) {
        response.redirectURL = 'http://localhost:4040'
      }
      callback(response)
    },
  )

  Object.keys(handler)
    .filter((it) =>
      [
        'onBeforeRequest',
        'onBeforeSendHeaders',
        'onSendHeaders',
        'onHeadersReceived',
      ].includes(it),
    )
    .forEach((key) => {
      const { filter, listener } = handler[key]
      session.defaultSession.webRequest[key](filter, listener)
    })
}

const handler = {
  onBeforeRequest: {
    filter: {
      urls: ['http://localhost:3030/*'],
      // urls: [], // 如果为空，则是匹配所有
    },
    listener: (details, callback) => {
      console.log('onBeforeRequest', details)
      const { url, resourceType } = details
      const response = { cancel: false }
      if (resourceType === 'xhr' && url.startsWith('http://localhost:3030')) {
        response.redirectURL = 'http://localhost:4040'
      }
      callback(response)
    },
  },
  onBeforeSendHeaders: {
    filter: {
      urls: ['*://localhost/*'], // 注意这样写端口号是不支持的，会报错，莫名其妙 https://github.com/electron/electron/issues/20347
    },
    listener: (details, callback) => {
      console.log('onBeforeSendHeaders', details)
      const headers = {
        ...details.requestHeaders,
        'User-Agent': 'MyAgent', // 修改 User-Agent
        Referer: 'https://baidu.com', // 修改 Referer
      }
      callback({ requestHeaders: headers })
    },
  },
  onSendHeaders: {
    filter: {
      urls: [],
    },
    listener: (details) => {
      console.log('onSendHeaders', details) // 可以观测在 onBeforeSendHeaders 里面做的改动
    },
  },
  onHeadersReceived: {
    filter: {
      urls: [],
    },
    listener: (details, callback) => {
      console.log('onHeadersReceived', details)
      const response = {
        cancel: false,
        responseHeaders: { A: 'B' }, // 修改响应 header
        statusLine: 'HTTP/1.1 404 NotFound', // 修改状态码
      }
      callback(response)
    },
  },
  onResponseStarted: {
    filter: {
      urls: [],
    },
    listener: (details) => {
      console.log('onResponseStarted', details)
      // 表示第一个字节j已经收到，这个时候修改的状态码和响应体都生效了
      // 虽然没有 callback 的地方对网络请求做不了hook，但是可以做一些其他事情，例如登录成功之后获取 cookie 等
    },
  },
  onBeforeRedirect: {
    filter: {
      urls: [],
    },
    listener: (details) => {
      console.log('onBeforeRedirect', details)
      // 检测到重定向，例如301和302
    },
  },
  onCompleted: {
    filter: {
      urls: [],
    },
    listener: (details) => {
      console.log('onCompleted', details)
      // 请求结束了
    },
  },
  onErrorOccurred: {
    filter: {
      urls: [],
    },
    listener: (details) => {
      console.log('onErrorOccurred', details)
      // 当请求出错的时候调用
    },
  },
}


function cors() {
  const filter = {
    urls: ['https://example.com/*'], // Remote API URS for which you are getting CORS error
  }

  // win.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   console.log('details', details)
  //   const { requestHeaders } = details
  //   // requestHeaders.Origin = 'https://example.com'
  //   callback({ requestHeaders })
  // })

  win.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
    const { responseHeaders } = details
    responseHeaders['Access-Control-Allow-Origin'] = ['*']
    // 'Access-Control-Allow-Headers': ['*'],
    callback({ responseHeaders })
  })

  // win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
  //   callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } })
  // })
  // win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       'Access-Control-Allow-Origin': ['*'],
  //       'Access-Control-Allow-Headers': ['*'],
  //       ...details.responseHeaders,
  //     },
  //   })
  // })
}
