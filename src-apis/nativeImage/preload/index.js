/*
const os = require('os')

const platform = os.platform()
const release = os.release()

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  document.getElementById('platform').append(platform)
  document.getElementById('release').append(release)
})
*/

window.fromPreload = 'something fromPreload'

// Date.now = () => 1

const { contextBridge } = require('electron')

// contextBridge.exposeInMainWorld('Date', {
//   now: () => 1,
// })

const fs = require('fs')
contextBridge.exposeInMainWorld('myAPI', {
  doSomething: () => { console.log('doSomething') },
  save: (filePath, fileContent)=>{
    //
    fs.writeFileSync(filePath, fileContent)
  }
})