const { app, BrowserWindow, Tray } = require('electron')
const path = require('path')

app.dock.hide()

app.whenReady().then(() => {
  createTrayWindow()
})

let win, tray
function createTrayWindow() {
  // createEmptyTray()

  const width = 300
  const height = 420
  win = new BrowserWindow({
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
  win.loadFile(path.join(__dirname, '../renderer/calculator.html'))

  win.setVisibleOnAllWorkspaces(true)

  // win.webContents.openDevTools({ mode: 'detach' })
  tray = new Tray(path.join(__dirname, 'calculatorTemplate.png'))
  tray.on('click', () => {
    const trayBounds = tray.getBounds()
    console.log(trayBounds)
    win.setPosition(trayBounds.x - width / 2 + trayBounds.width / 2, trayBounds.height)
    console.log(win.getPosition())
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
  win.on('blur', () => {
    win.hide()
  })
}

function createEmptyTray() {
  for (let i = 0; i < 15; i++) {
    new Tray(path.join(process.cwd(), 'public/img/emptyTemplate.png'))
  }
}
