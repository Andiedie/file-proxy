export default {
  logLevel: process.env.LOG_LEVEL || 'info',
  port: process.env.PORT || '19126',
  // HTTP 缓存时间，单位秒
  cacheExpire: Number(process.env.CACHE_EXPIRE) || 10 * 60,
  // tslint:disable max-line-length
  ua: process.env.UA || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
  proxy: process.env.PROXY || 'http://localhost:1087',
  // 本地缓存文件过期时间，过期后文件将被删除，单位毫秒   一周
  fileExpire: Number(process.env.FILE_EXPIRE) || 7 * 24 * 60 * 60 * 1000,
  // 过期文件每天几点被清理 0-23
  cleanerAlarm: Number(process.env.CLEANER_ALARM) || 4,
};
