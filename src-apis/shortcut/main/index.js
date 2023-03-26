const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const localShortcut = require('electron-localshortcut')

app.whenReady().then(() => {
  createWindow()
  createApplicationMenu()
  registerGlobalShortcut('Cmd+Alt+K')
})

let win1, win2
function createWindow() {
  win1 = new BrowserWindow({
    width: 600,
    height: 400,
  })
  win1.loadURL('https://www.baidu.com')
  localShortcut.register(win1, 'Ctrl+Shift+K', () => {
    console.log('register local shortcut for win1')
  })

  win2 = new BrowserWindow({
    width: 600,
    height: 400,
  })
  win2.loadURL('https://www.taobao.com')
  localShortcut.register(win2, 'Ctrl+Shift+T', () => {
    console.log('register local shortcut for win2')
  })
}

function createApplicationMenu() {
  const tpl = [
    {
      label: '自定义菜单',
      submenu: [
        {
          label: '打开控制台',
          role: 'toggleDevTools',
        },
        {
          label: '绑定快捷键',
          accelerator: 'Ctrl+Shift+K',
          visible: false,
          click: () => {
            console.log('menu shortcut pressed')
          },
        },
      ],
    },
  ]
  if (process.platform === 'darwin') {
    tpl.unshift({ label: '' })
  }
  const menu = Menu.buildFromTemplate(tpl)
  Menu.setApplicationMenu(menu)
}

function registerGlobalShortcut(shortcut) {
  if (!shortcut) return false
  let flag = false
  try {
    flag = globalShortcut.isRegistered(shortcut)
    if (flag) return true
    flag = globalShortcut.register(shortcut, () => {
      console.log('toggle shortcut')
    })
  } catch (e) {
    console.error(e)
  }
  return flag
}
