const { webFrame, contextBridge } = require('electron')

function webFrameApi() {
  webFrame.setZoomFactor(2)

  // 动态加载CSS
  const css = `body { background-color: pink; }`
  const key = webFrame.insertCSS(css)
  setTimeout(() => {
    webFrame.removeInsertedCSS(key)
  }, 5000)

  // 执行JS代码
  const js = `console.log('executeJavaScript');[1,2,3].pop();`
  const p = webFrame.executeJavaScript(js)
  p.then((result) => console.log(result)).catch((e) => console.log('js执行出错', e))

  // 在 isolated 空间执行 JS 代码
  // const p2 = webFrame.executeJavaScriptInIsolatedWorld(0, { code: js })
  // p2.then((result) => console.log(result)).catch((e) => console.log('js执行出错', e))

  const usage = webFrame.getResourceUsage()
  console.log(usage)
}


contextBridge.exposeInMainWorld('jsBridge', {
  webFrameApi
})
