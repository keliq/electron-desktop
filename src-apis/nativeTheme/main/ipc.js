const { ipcMain, nativeTheme } = require('electron')

/*
ipcMain.on('isDarkMode', (event, args) => {
  // console.log(event)
  const isDarkMode = nativeTheme.shouldUseDarkColors
  event.returnValue = isDarkMode
  event.reply('isDarkMode', isDarkMode)
  // event.sender.send('isDarkMode', nativeTheme.shouldUseDarkColors)
})
*/
/*
ipcMain.on('isDarkMode', (event, args) => {
  console.log(nativeTheme.shouldUseDarkColors)
  event.sender.send('isDarkMode', nativeTheme.shouldUseDarkColors)
})
*/

ipcMain.handle('isDarkMode', (event, args) => {
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('setTheme', (event, theme) => {
  nativeTheme.themeSource = theme
})
