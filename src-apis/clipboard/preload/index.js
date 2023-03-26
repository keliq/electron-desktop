const { contextBridge, clipboard } = require('electron')
const fs = require('fs')

contextBridge.exposeInMainWorld('myAPI', {
  doSomething: () => {
    console.log('doSomething')
  },
  save: (filePath, fileContent) => {
    fs.writeFileSync(filePath, fileContent)
  },
})
