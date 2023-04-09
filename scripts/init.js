const minimist = require('minimist')
const { src, name } = minimist(process.argv.slice(1))
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const pkg = require('../package.json')
pkg.main = `src-${src}/${name}/main/index.js`
fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2))

const child = spawn('npm', ['start'])

child.stdout.on('data', (data) => console.log(`${data}`))
child.stderr.on('data', (data) => console.error(`${data}`))
child.on('close', (code) => console.log(`child process close with code ${code}`))
child.on('exit', (code) => console.log(`child process exit`, code))
child.on('error', (e) => console.error(e))

process.on('SIGINT', function () {
  delete pkg.main
  fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2))
  process.exit(0)
})
