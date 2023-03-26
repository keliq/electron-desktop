const { app, systemPreferences } = require('electron')

app.whenReady().then(() => {
  systemPreferencesApi()
})

function systemPreferencesApi() {
  systemPreferences.postNotification('event', { name: 'david' })
  console.log('color', systemPreferences.getAccentColor())
}
