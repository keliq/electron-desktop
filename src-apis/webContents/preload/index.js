const { ipcRenderer, contextBridge } = require('electron')

const listeners = []

function send() {
  const sp = new URLSearchParams(location.search)
  const from = sp.get('from')
  const to = sp.get('to')
  const data = { from, to, msg: `hello ${to}, this is msg from ${from}` }
  ipcRenderer.send('communicate', data)
}

ipcRenderer.on('communicate', (event, data) => listeners.forEach((f) => f(data)))

function findInPage(data) {
  ipcRenderer.send('findInPage', data)
}

contextBridge.exposeInMainWorld('jsApi', {
  send,
  listen: (cb) => listeners.push(cb),
  findInPage,
})
