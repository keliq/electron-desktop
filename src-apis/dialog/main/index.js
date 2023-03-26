const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

app.whenReady().then(() => {
  createWindow()
  createWindow2()
  setTimeout(() => {
    // showOpenDialog()
    // showSaveDialog()
    showMessageBox()
    // showErrorBox()
    // showCertificateTrustDialog()
  }, 1000)
})

let win
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  win.setSheetOffset(500)
  win.on('sheet-begin', (event) => {
    console.log('sheet-begin', event)
  })
  win.on('sheet-end', (event) => {
    console.log('sheet-end', event)
  })
  setTimeout(() => {
    // win.close()
  }, 200)
}

let win2
function createWindow2() {
  win2 = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'window2',
  })
}

// 如果第一个参数是 browserwindow 的话，会表现为 sheet ，否则就是普通的模态框
// sheet 的话会浮在窗口上面，你是改变不了其位置的

function showOpenDialog() {
  // const result = dialog.showOpenDialogSync({
  //   properties: ['openFile', 'multiSelections'],
  // })
  // console.log(result)

  dialog
    .showOpenDialog({
      // title: '请选择文件',
      // defaultPath: '/Users/keliq/code',
      // buttonLabel: '选择决定命运',
      properties: ['openFile', 'multiSelections', 'openDirectory', 'showHiddenFiles'],
      // message: 'macOS 系统上 title 属性不生效，但是可以使用 message 在此显示一条消息',
      filters: [
        { name: '图片', extensions: ['jpg', 'png', 'gif'] },
        { name: '视频', extensions: ['mkv', 'avi', 'mp4'] },
        { name: '自定义文件类型', extensions: ['json'] },
        { name: '任意类型', extensions: ['*'] },
      ],
    })
    .then((it) => console.log(it))
}

function showSaveDialog() {
  // 这里指定 win2 似乎不起作用？
  dialog
    .showSaveDialog({
      title: '请保存到一个隐蔽的位置',
    })
    .then((it) => console.log(it))
}

function showMessageBox() {
  dialog
    .showMessageBox(win, {
      icon: path.join(process.cwd(), 'public/img/apple.png'),
      // type: 'warning',
      type: 'info',
      title: '消息标题', // 可能不显示
      message: '消息内容',
      detail: '更详细的信息',
      // textWidth: 500,
      buttons: [
        '按钮1',
        '按钮2',
        // '按钮3',
        // '按钮4',
        // '按钮5',
      ],
      defaultId: 1, // 默认选中的按钮索引
      // cancelId: 1,
      // checkboxLabel: '觉得自己帅的请勾上此选项', // 带复选框、
      // buttons: ['按钮1', '按钮2', '按钮3'],
    })
    .then((it) => {
      console.log('result', it)
    })
}

function showErrorBox() {
  console.log(dialog.showErrorBox('标题', '具体内容'))
}

function showCertificateTrustDialog() {
  console.log(
    dialog.showCertificateTrustDialog({
      message: `自定义的消息内容：\n请务必信任该证书，否则应用无法顺利运行`,
      certificate: {
        data: fs.readFileSync(path.join(__dirname, './cert.pem'), 'utf8'),
      },
    }),
  )
}
