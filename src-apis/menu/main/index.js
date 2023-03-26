const { app, Menu, BrowserWindow, Tray, ShareMenu } = require('electron')
const path = require('path')

let win

app.whenReady().then(() => {
  createWindow()
  // createMenu()
  // createTray()
  // createDockMenu()
  // showShareMenu()
  popupMenu()
})

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
  win.loadFile(path.join(__dirname, '../renderer/index.html'))
}

const tpl2 = [
  {
    label: '拨打电话',
  },
  {
    label: '子菜单',
    submenu: [
      {
        label: '点我试试',
        click: () => {
          console.log('try')
        },
      },
      {
        label: '默认选中',
        type: 'checkbox',
        checked: true,
      },
      { type: 'separator' },
      {
        label: '单选菜单',
        submenu: [
          { label: '选项1', type: 'radio' },
          { label: '选项2', type: 'radio' },
          { label: '选项3', type: 'radio' },
        ],
      },
      {
        label: '多级菜单',
        submenu: [
          {
            label: '二级菜单',
            submenu: [{ label: '三级菜单', submenu: [{ label: '四级菜单' }] }],
          },
        ],
      },
    ],
  },
  {
    label: '调试工具',
    submenu: [
      { role: 'toggleDevTools' },
      {
        role: 'reload',
        accelerator: 'Shift+K',
        click: () => {
          console.log('reload')
        },
      },
      {
        role: 'windowmenu',
      },
    ],
  },
  {
    type: 'separator',
  },
  {
    label: '退出',
    role: 'quit',
  },
]

const tpl = [
  {
    label: '自定义菜单',
    submenu: [
      {
        label: '点我试试',
        click: () => {
          console.log('try')
        },
      },
      {
        label: '默认选中',
        type: 'checkbox',
        checked: true,
      },
      { type: 'separator' },
      {
        label: '单选菜单',
        submenu: [
          { label: '选项1', type: 'radio' },
          { label: '选项2', type: 'radio' },
          { label: '选项3', type: 'radio' },
        ],
      },
      {
        label: '多级菜单',
        submenu: [
          {
            label: '二级菜单',
            submenu: [{ label: '三级菜单', submenu: [{ label: '四级菜单' }] }],
          },
        ],
      },
    ],
  },
  {
    label: '调试菜单',
    submenu: [
      { role: 'toggleDevTools' },
      {
        role: 'reload',
        accelerator: 'Shift+K',
        click: () => {
          console.log('reload')
        },
      },
    ],
  },
]

function createMenu() {
  // Mac 系统要把第一个菜单的位置留出来
  const template = [...tpl]
  if (process.platform === 'darwin') {
    template.unshift({ label: '' })
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

let tray

function createTray() {
  createEmptyTray()
  tray = new Tray(path.join(process.cwd(), 'public/imge/phoneTemplate.png'))
  const contextMenu = Menu.buildFromTemplate(tpl2)
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu) // 设置托盘菜单
  tray.on('click', () => {
    console.log('tray clicked')
  })

  setTimeout(() => {
    const popUpMenu = Menu.buildFromTemplate(tpl.slice(1))
    // 能够自动弹出托盘菜单的API
    tray.popUpContextMenu(popUpMenu)
  }, 10000)
}

function createDockMenu() {
  const { dock } = app
  const menu = Menu.buildFromTemplate(tpl)
  dock.setMenu(menu)
  // console.log('menu', dock.getMenu())
}

// 在鼠标所在的位置显示shareMenu
function showShareMenu() {
  const menu = new ShareMenu({
    urls: ['https://www.baidu.com'],
  })
  setTimeout(() => {
    menu.popup()
  }, 5000)
}

function popupMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: '文字加粗',
      click: () => {
        console.log('try')
      },
    },
    {
      label: '改变颜色',
      click: () => {
        console.log('try')
      },
    },
  ])
  setTimeout(() => {
    menu.popup({
      // window: BrowserWindow.getFocusedWindow(),
      // x: 10, // 相对于窗口的x轴偏移，默认是鼠标位置的横坐标
      // y: 20, // 相对于窗口的y轴偏移，默认是鼠标位置的纵坐标
      callback: () => {
        console.log('menu closed')
      },
    })
  }, 3000)
}

function createEmptyTray() {
  for (let i = 0; i < 10; i++) {
    new Tray(path.join(process.cwd(), 'public/img/emptyTemplate.png'))
  }
}
