define({
  "name": "武大投票服务端",
  "version": "1.0.0",
  "description": "武大投票服务端",
  "title": "武大投票服务端",
  "url": "http://119.27.170.247:3000",
  "header": {
    "title": "武大投票服务端",
    "content": "<h1>武大校友会API</h1>\n<p>此处提供 <code>投票</code>、<code>在线学习</code> 模块 API。目前只是测试地址，等正式服务器安排妥当，地址配置会加上正式地址</p>\n<h2>基础说明</h2>\n<h3>1.  测试地址</h3>\n<ol>\n<li>BaseUrl <code>http://119.27.170.247:3000</code></li>\n</ol>\n<p>例如: <code>/api/auth/login</code> 接口 访问时使用 使用  <code>http://119.27.170.247:3000/api/auth/login</code></p>\n<h3>2. 文件服务</h3>\n<p>【注意】目前只是临时如此访问，切换正式服务器会更换</p>\n<ol>\n<li>文件上传\nBaseUrl: <code>http://119.27.170.247:3000</code></li>\n</ol>\n<p>a. 图片上传  POST: <code>${BaseUrl}/api/files/image</code>, 只能上传 .jpg .png 格式图片\nb. 上传  POST: <code>${BaseUrl}/api/files/image</code></p>\n<p>上述接口会返回媒体文件名称，访问媒体文件如下</p>\n<p>c. 访问图片 <code>http://119.27.170.247:4534/image/a.jpg</code>\nc. 访问视屏 <code>http://119.27.170.247:4534/video/b.mp4</code></p>\n"
  },
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2019-10-15T06:39:18.680Z",
    "url": "http://apidocjs.com",
    "version": "0.17.7"
  }
});
