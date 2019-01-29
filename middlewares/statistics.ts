import { differenceInHours, distanceInWordsToNow } from 'date-fns';
import zhLocale = require('date-fns/locale/zh_cn');
import fs = require('fs');
import Koa = require('koa');
import pidusage = require('pidusage');
import folderSize from '../utils/folderSize';
import gitHash from '../utils/gitHash';
import * as path from '../utils/path';

const statistics = {
  hash: gitHash(),
  requestCount: 0,
  cacheHits: 0,
};

export const middleware: Koa.Middleware = async (ctx, next) => {
  await next();
  statistics.requestCount++;
  if (ctx.response.headers['X-Cache'] === 'HIT') {
    statistics.cacheHits++;
  }
};

export const getStatistics = async () => {
  const now = new Date();
  const stats = await pidusage(process.pid);
  const startTime = new Date(now.getTime() - stats.elapsed);
  const elapsedHour = differenceInHours(now, startTime) + 1;
  const cacheHits = statistics.cacheHits;
  const cacheFileCount = fs.readdirSync(path.files).length - 2;

  return {
    upTime: distanceInWordsToNow(startTime, {locale: zhLocale}),
    hashFull: statistics.hash,
    hashShort: statistics.hash.slice(0, 7),
    requestCount: statistics.requestCount,
    requestPerHour: Math.floor(statistics.requestCount / elapsedHour),
    // ignore .gitkeep and __STORE__.json
    cacheFileCount: cacheFileCount < 0 ? 0 : cacheFileCount,
    cacheFileSize: folderSize(path.files),
    cacheHitRate: ((cacheHits / statistics.requestCount * 100) || 0).toFixed(2) + '%',
    memory: `${(stats.memory / (1024 * 1024)).toFixed(2)} MB`,
    cpu: `${stats.cpu.toFixed(2)}%`,
  };
};
