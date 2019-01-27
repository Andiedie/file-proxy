export default {
  logLevel: process.env.LOG_LEVEL || 'info',
  port: process.env.PORT || '19126',
  cacheExpire: Number(process.env.CACHE_EXPIRE) || 10 * 60,
  // tslint:disable max-line-length
  ua: process.env.UA || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
  proxy: process.env.PROXY || 'http://localhost:1087',
};
