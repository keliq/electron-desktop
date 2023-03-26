const { app, autoUpdater, dialog } = require('electron')

const server = 'http://localhost:3030'
const url = `${server}?platform=${process.platform}&version=${app.getVersion()}`
console.log('url', url)
autoUpdater.setFeedURL({ url })

autoUpdater.on('checking-for-update', (...args) => {
  console.log('checking-for-update', args)
})

autoUpdater.on('update-available', (...args) => {
  console.log('update-available', args)
})

autoUpdater.on('update-not-available', (...args) => {
  console.log('update-not-available', args)
})

autoUpdater.on('update-downloaded', (...args) => {
  console.log('update-downloaded', args)
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application')
  console.error(message)
})

function autoUpdaterApi() {
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10000)
}

autoUpdaterApi()

