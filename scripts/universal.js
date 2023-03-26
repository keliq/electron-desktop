const { makeUniversalApp } = require('@electron/universal')
const path = require('path')

makeUniversalApp({
  x64AppPath: path.join(__dirname, 'electron-desktop-darwin-x64/electron-desktop.app'),
  arm64AppPath: path.join(__dirname, 'electron-desktop-darwin-arm64/electron-desktop.app'),
  outAppPath: path.join(__dirname, 'electron-desktop-darwin-universal/electron-desktop.app'),
})
  .then((it) => {
    console.log(it)
  })
  .catch((e) => {
    console.log(e)
  })
