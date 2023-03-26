const { ipcRenderer } = require('electron')

if (typeof ipcRenderer.invoke !== 'function') {
  let id = 0
  const invokePolyfill = (channel, ...args) => {
    const thisId = id++
    return new Promise((resolve, reject) => {
      const callback = (event, resp) => {
        if (resp.id !== thisId || resp.channel !== channel) return
        resolve(resp.body)
        ipcRenderer.removeListener('invoke_polyfill', callback)
      }
      ipcRenderer.on('invoke_polyfill', callback)
      ipcRenderer.send('invoke_polyfill', { id: thisId, channel, request: args })
    })
  }
  ipcRenderer.invoke = invokePolyfill
}
