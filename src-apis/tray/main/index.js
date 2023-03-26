const { app, Menu, BrowserWindow, Tray } = require('electron')
const path = require('path')

let win
let tray

app.whenReady().then(() => {
  // tray = new Tray(path.join(process.cwd(), 'pubilc/img/phoneTemplate.png'))
  createWindow()
  createTray()
  // createTrayWindow()
  // trayWithBalloon()
  // trayEvents()
})

function trayWithBalloon() {
  tray = new Tray(path.join(process.cwd(), 'public/img/phoneTemplate.png'))
  setTimeout(() => {
    console.log('displayBalloon')
    // 这是在Windows系统上才有的 API
    tray.displayBalloon({
      icon: path.join(process.cwd(), 'public/img/apple.png'),
      title: '你好',
      content: '内容',
    })
  }, 2000)
  setTimeout(() => {
    tray.removeBalloon()
  }, 5000)
}

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 500,
  })
}

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
      {
        role: 'windowmenu',
      },
    ],
  },
]

const menus = [
  {
    label: '关于',
    role: 'about',
  },
  { type: 'separator' },
  {
    label: '自定义菜单',
    click: () => {
      console.log('点击自定义')
    },
  },
  {
    label: '子菜单',
    submenu: [
      {
        label: '显示窗口',
        click: () => {
          console.log('点击了二级菜单')
        },
      },
      {
        label: '打开控制台',
        role: 'toggleDevTools',
      },
    ],
  },
  { type: 'separator' },
  {
    label: '退出',
    role: 'quit',
  },
]

function createEmptyTray() {
  for (let i = 0; i < 10; i++) {
    new Tray(path.join(process.cwd(), 'public/img/emptyTemplate.png'))
  }
}

function createTray() {
  createEmptyTray()
  tray = new Tray(path.join(process.cwd(), 'public/img/phoneTemplate.png'))
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu) // 设置托盘菜单
  tray.setToolTip('点击查看当日天气情况')
  // tray.on('click', () => {
  //   console.log('tray clicked')
  // })
  // 能够自动弹出托盘菜单的API
  setTimeout(() => {
    const popUpMenu = Menu.buildFromTemplate([menus[0], menus[menus.length - 1]])
    tray.popUpContextMenu(popUpMenu)
  }, 5000)
}

let trayWindow
function createTrayWindow() {
  tray = new Tray(path.join(process.cwd(), 'public/img/phoneTemplate.png'))
  // 这个 API 可以获取托盘的位置，通过创建自定义窗口，可实现托盘弹窗的效果
  const width = 300
  const height = 300
  trayWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,
    show: false,
    movable: false,
    minimizable: false,
    skipTaskbar: true,
    maximizable: false,
  })
  trayWindow.loadFile(path.join(__dirname, '../renderer/tray.html'))
  trayWindow.webContents.openDevTools({ mode: 'detach' })
  tray.on('click', () => {
    const trayBounds = tray.getBounds()
    console.log('tray bounds', trayBounds)
    trayWindow.setPosition(trayBounds.x - width / 2 + trayBounds.width / 2, trayBounds.y)
    if (trayWindow.isVisible()) {
      trayWindow.hide()
    } else {
      trayWindow.show()
    }
  })
  trayWindow.on('blur', () => {
    // trayWindow.hide()
  })
  trayWindow.on('closed', function () {
    trayWindow = null
  })
}

// ● click：鼠标单击
// ● right-click：鼠标右击
// ● double-click：双击
// ● mouse-up：
// ● mouse-down
// ● mouse-enter
// ● mouse-leave
// ● mouse-move

function trayEvents() {
  tray = new Tray(path.join(process.cwd(), 'public/img/phoneTemplate.png'))
  tray.on('click', (event, bounds, position) => {
    console.log('click', bounds, position)
  })

  // 注意：double-click 的时候，会先响应一次 click 事件
  tray.on('double-click', (event) => {
    console.log('double-click')
  })

  tray.on('right-click', (event) => {
    console.log('right-click')
  })

  // tray.on('mouse-up', (event) => {
  //   console.log('mouse-up')
  // })
  // tray.on('mouse-down', (event) => {
  //   console.log('mouse-down')
  // })
  // tray.on('mouse-enter', (event) => {
  //   console.log('mouse-enter')
  // })
  // tray.on('mouse-leave', (event) => {
  //   console.log('mouse-leave')
  // })
  // tray.on('mouse-move', (event) => {
  //   console.log('mouse-move')
  // })

  // 还可以响应拖动事件，例如放文件、放文本等
  tray.on('drop-files', (event, files) => {
    console.log('drop-files', files)
  })
  tray.on('drop-text', (event, text) => {
    console.log('drop-text', text)
  })
  tray.on('drop', (event) => {
    console.log('drop')
  })
  tray.on('drag-enter', (event) => {
    console.log('drag-enter')
  })
  tray.on('drag-leave', (event) => {
    console.log('drag-leave')
  })
  tray.on('drag-end', (event) => {
    console.log('drag-end')
  })
}
