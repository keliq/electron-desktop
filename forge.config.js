const path = require('path')

console.log('forge.config.js')

module.exports = {
  packagerConfig: {
    // dir: path.join(__dirname, 'dest'), // 这个是覆盖不了的
    outputDirectory: 'xxx',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
}
