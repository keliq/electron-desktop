const { ipcRenderer, contextBridge, webFrame } = require('electron')

console.log(webFrame)
setTimeout(() => {
  console.log('firstChild', webFrame.firstChild)
  console.log('top', webFrame.top)
}, 5000)

contextBridge.exposeInMainWorld('jsBridge', {
  sendSync: (channel, ...args) => {
    return ipcRenderer.sendSync(channel, ...args)
  },
  send: (channel, ...args) => {
    return ipcRenderer.send(channel, ...args)
  },
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  listen: (channel, cb) => {
    ipcRenderer.on(channel, cb)
  },
})
