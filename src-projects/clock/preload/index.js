const { ipcRenderer,webFrame } = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  
  webFrame.insertCSS('html body { background: transparent; }')

  const clock = document.getElementById('clock')
  clock.addEventListener('mouseenter', () => {
    ipcRenderer.send('set-ignore-mouse-events', false)
  })
  clock.addEventListener('mouseleave', () => {
    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
  })
})
