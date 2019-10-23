# 武大校友会API
此处提供投票模块 API。

## 基础说明
### 1.  API访问地址
1. BaseUrl `http://alumnihome1893.whu.edu.cn/vote_api`

例如: `/api/auth/login` 接口 访问时使用 使用  `http://alumnihome1893.whu.edu.cn/vote_api/api/auth/login`

### 2. 文件服务 

1. 文件上传

BaseUrl: ` http://alumnihome1893.whu.edu.cn/fs_upload`

a. 图片上传  POST: `${BaseUrl}/api/files/image`, 只能上传 .jpg .png 格式图片

b. 上传视屏  POST: `${BaseUrl}/api/files/video`

上述接口会返回媒体文件名称，访问媒体文件如下

2. 文件访问

BaseUrl: `http://alumnihome1893-1.whu.edu.cn/fs_download`

c. 访问图片 `${BaseUrl}/image/a.jpg`

c. 访问视屏 `${BaseUrl}/video/b.mp4`
