const { app, BrowserWindow, nativeImage, clipboard } = require('electron')
const path = require('path')
var fs = require('fs')

app.whenReady().then(() => {
  console.log(clipboard)

  const imgPath = path.join(process.cwd(), 'pubilc/img/apple.png')
  const buffer = fs.readFileSync(imgPath)
  const base64 = buffer.toString('base64')
  // console.log('buffer', buffer)
  // console.log('base64', base64)
  // const img = nativeImage.createFromBuffer(buffer)
  // const img = nativeImage.createFromDataURL(`data:image/png;base64,${base64}`)
  const img = nativeImage.createFromPath(imgPath)
  // console.log('bitmap', img.toBitmap())
  console.log('toPNG', img.toPNG())
  console.log('toJPEG', img.toJPEG(80))
  console.log('toDataURL', img.toDataURL())

  clipboard.writeImage(img)

  console.log('size', img.getSize())
  // img.addRepresentation({ scaleFactor: 2 })
  console.log('getScaleFactors', img.getScaleFactors())
  console.log('getAspectRatio', img.getAspectRatio())
  img.setTemplateImage(true)
  console.log('isTemplateImage', img.isTemplateImage())
  // const newImg = img.resize({ width: 200, height: 100 }) // 改变大小
  const newImg = img.crop({ x: 10, y: 10, width: 20, height: 20 })
  console.log('getScaleFactors2', newImg.getScaleFactors())
  console.log('getAspectRatio2', newImg.getAspectRatio())
  fs.writeFileSync(path.join(__dirname, 'a.jpeg'), img.toJPEG(90))
})
