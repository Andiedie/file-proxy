# File Proxy
个人使用的静态文件代理服务器。

## Usage
```bash
git clone git@github.com:Andiedie/file-proxy.git
yarn install
yarn start
# 设置代理服务器
PROXY=http://127.0.0.1:1087 yarn start
```

服务器运行在 `19126` 端口。（仓库创建时间 `2019.01.26`）

## API
所有 API 均支持 [跨域 CORS](https://developer.mozilla.org/zh/docs/Web/HTTP/Access_control_CORS)，支持 [范围请求 Range requests](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Range_requests)。

假设目标文件 URL 为 `https://example.com/foo.bar`

- 代理静态资源：解决跨域问题

  建议编码
  ```
  http://localhostL19126/https%3A%2F%2Fexample.com%2Ffoo.bar
  ```
  没有特殊字符的话也可以直接来
  ```
  http://localhost:19126/https://example.com/foo.bar
  ```

- 通过二级代理服务器代理静态资源：解决访问限制

  ```
  http://localhostL19126/https%3A%2F%2Fexample.com%2Ffoo.bar?proxy=true
  ```
  此时服务器会通过配置项中的 `proxy` 进行请求。

## 主页
直接访问 `localhost:19126` 可以访问带有统计信息的主页。

## 配置
见文件 `config.ts`。

```javascript
export default {
  // 日志输出等级
  logLevel: process.env.LOG_LEVEL || 'info',
  // 端口
  port: process.env.PORT || '19126',
  // HTTP 缓存时间，单位秒
  cacheExpire: Number(process.env.CACHE_EXPIRE) || 10 * 60,
  // User Agent
  ua: process.env.UA || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
  proxy: process.env.PROXY || 'http://localhost:1087',
  // 本地缓存文件过期时间，过期后文件将被删除，单位毫秒   一周
  fileExpire: Number(process.env.FILE_EXPIRE) || 7 * 24 * 60 * 60 * 1000,
  // 过期文件每天几点被清理 0-23
  cleanerAlarm: Number(process.env.CLEANER_ALARM) || 4,
};
```

## LICENSE
MIT
