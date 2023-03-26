const fs = require('fs')
const path = require('path')
const { execFileSync, spawnSync } = require('child_process')
const originalFs = require('original-fs')
const { app } = require('electron')

// const { add } = require(path.join(process.cwd(), 'test.asar/add.node'))
// const { add } = require(path.join(process.cwd(), 'test.asar.unpacked/add.node'))
// const { add } = require("./build/Release/add2.node");
console.log(add(1, 2))


// const pkg = require(path.join(process.cwd(), 'dist.asar/package.json'))
// const content = fs.readFileSync(path.join(process.cwd(), 'test.asar/del.js'), 'utf8')
// console.log(content)

// console.log('temp', app.getPath('temp'))
// console.log(spawnSync(path.join(process.cwd(), 'test.asar/a')))

// fs.openSync(path.join(process.cwd(), 'test.asar/del.js'))
// const asar = originalFs.readFileSync(path.join(process.cwd(), 'dist.asar'), 'utf8')
// console.log('asar', asar)
