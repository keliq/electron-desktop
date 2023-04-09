const { app, BrowserWindow, Notification } = require('electron')
const path = require('path')

let win

app.whenReady().then(() => {
  // createWindow()
  notificationApi()
})

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
}

function notificationApi() {
  // app.setAppUserModelId('xxx')
  const notice = new Notification({
    title: '天气预报',
    subtitle: '-----------',
    body: '今天有雨🌧，请注意打伞',
    icon: path.join(process.cwd(), 'public/img/apple.png'),
    closeButtonText: 'close',
  })
  setTimeout(() => {
    notice.show()
  }, 2000)
}
