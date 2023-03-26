/**
 * app 本质上就是个 event-emitter 实例
 */
const { app } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  pathApi()
  // eventApi()
  // dockApi()
  // protocolApi()
})

function pathApi() {
  const result = {
    appPath: app.getAppPath(),
  }
  ;[
    'home',
    'appData',
    'userData',
    'cache',
    'temp',
    'exe',
    'module',
    'desktop',
    'documents',
    'downloads',
    'music',
    'pictures',
    'videos',
    // 'recent', windows only
    'logs',
    'crashDumps',
  ].forEach((key) => {
    result[key] = app.getPath(key)
  })
  console.log('path', result)
}

function eventApi() {
  app.on('xxx', (...args) => {
    console.log('args', args)
  })
  setTimeout(() => {
    app.emit('xxx', { name: 'keliq', age: 18 })
  }, 5000)
}

// 可以用于动态修改 dock 的图标（例如圣诞节、春节的时候）
function dockApi() {
  const { dock } = app
  // 如果 app 是 focused，那么这个 API 是不可用的，直接返回 -1 https://www.electronjs.org/docs/latest/api/dock#dockbouncetype-macos
  const int = dock.bounce()
  let i = 1
  dock.setIcon(path.join(process.cwd(), 'public/img/apple.png'))
  setTimeout(() => {
    dock.setIcon(path.join(process.cwd(), 'pubic/img/pineapple.png'))
  }, 3000)
  setInterval(() => {
    // const int = dock.bounce(['informational']) // 默认值，只跳一次
    // const int = dock.bounce(['critical']) // 一直跳，知道 active 或者 cancel
    console.log('int', int)
    // dock.setIcon(path.join(process.cwd(),'img', i % 2 === 0 ? 'apple.png' : 'pineapple.png'))
    dock.setBadge(i.toString())
    i++
    const badgeStr = dock.getBadge()
    console.log('badgeStr', badgeStr)
  }, 5000)
}

function protocolApi() {
  const protocol = 'electron-desktop'
  // console.log('removeAsDefaultProtocolClient', app.removeAsDefaultProtocolClient(protocol))
  // console.log('setAsDefaultProtocolClient', app.setAsDefaultProtocolClient(protocol))
  console.log('isDefaultProtocolClient', app.isDefaultProtocolClient(protocol))
}
