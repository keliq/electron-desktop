const { ipcMain } = require('electron')

if (typeof ipcMain.handle !== 'function') {
  const listeners = {}
  ipcMain.on('invoke_polyfill', (event, data) => {
    const { id, channel, request } = data
    Promise.resolve(
      (() => {
        try {
          if (!listeners[channel]) {
            throw new Error('unregistered')
          }
          return listeners[channel](event, ...request)
        } catch (e) {
          return Promise.reject(e.message)
        }
      })(),
    )
      .then((resp) => {
        event.sender.send('invoke_polyfill', { success: true, id, channel, body: resp })
      })
      .catch((err) => {
        event.sender.send('invoke_polyfill', {
          success: false,
          id,
          channel,
          request,
          err: err.message || JSON.stringify(err),
        })
      })
  })
  const handlePolyfill = (channel, listener) => {
    listeners[channel] = listener
  }

  ipcMain.handle = handlePolyfill
}
