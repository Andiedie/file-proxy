export default {
  logLevel: process.env.LOG_LEVEL || 'info',
  port: process.env.PORT || '19126',
  cacheExpire: process.env.CACHE_EXPIRE || 5 * 60,
};
