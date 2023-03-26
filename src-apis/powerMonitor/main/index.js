const { app, powerMonitor, powerSaveBlocker } = require('electron')
const path = require('path')

const eventNames = [
  'suspend',
  'resume',
  'on-ac',
  'on-battery',
  'shutdown',
  'lock-screen',
  'unlock-screen',
  'user-did-become-active',
  'user-did-resign-active',
]

setInterval(() => {
  // console.log(powerMonitor.getSystemIdleState(10))
  // console.log(powerMonitor.getSystemIdleTime())
  // console.log(powerMonitor.onBatteryPower)
}, 3000)

app.whenReady().then(() => {
  eventNames.forEach((name) => {
    powerMonitor.on(name, () => {
      console.log(name)
    })
  })
  // console.log(powerMonitor.isOnBatteryPower(), powerMonitor.onBatteryPower)
  // prevent-app-suspension、prevent-display-sleep
  const id = powerSaveBlocker.start('prevent-display-sleep')
  console.log(powerSaveBlocker.isStarted(id))
  setTimeout(() => {
    powerSaveBlocker.stop(id)
    console.log(powerSaveBlocker.isStarted(id))
  }, 5000)

  // 延缓关机
  powerMonitor.on('shutdown', (e) => {
    e.preventDefault()
  })
})
