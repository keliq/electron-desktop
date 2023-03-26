const { contextBridge, ipcRenderer } = require('electron')

// const value = ipcRenderer.sendSync('isDarkMode')
// console.log('sendSync reply', value)

// ipcRenderer.send('isDarkMode')
// ipcRenderer.on('isDarkMode', (event, value) => {
//   console.log('on reply', value)
// })

window.setTheme = (theme) => {
  ipcRenderer.invoke('setTheme', theme)
}

contextBridge.exposeInMainWorld('preloadApi', {
  setTheme: (theme) => {
    ipcRenderer.invoke('setTheme', theme)
  },
})

document.addEventListener('DOMContentLoaded', () => {
  const p = document.getElementById('isDarkMode')
  ipcRenderer.invoke('isDarkMode').then((value) => p.append(value ? 'Yes' : 'No'))
})
