const minimist = require('minimist')
const { src, name } = minimist(process.argv.slice(1))
const { spawn } = require('child_process')

const main = `src-${src}/${name}/main/index.js`
const child = spawn('npx', ['electron', main])

child.stdout.on('data', (data) => console.log(`${data}`))
child.stderr.on('data', (data) => console.error(`${data}`))
child.on('close', (code) => console.log(`child process close with code ${code}`))
child.on('exit', (code) => console.log(`child process exit`, code))
child.on('error', (e) => console.error(e))

process.on('SIGINT', () => process.exit(0))
