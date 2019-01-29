import { differenceInMinutes, distanceInWordsToNow } from 'date-fns';
import zhLocale = require('date-fns/locale/zh_cn');
import * as fs from 'fs';
import * as Koa from 'koa';
import * as path from 'path';
import pidusage = require('pidusage');
import root from '../utils/root';

const html = fs.readFileSync(path.resolve(root, './assets/index.html')).toString();

const homepage: Koa.Middleware = async (ctx, next) => {
  if (ctx.path !== '/') {
    return next();
  }
  const now = new Date();
  const stats = await pidusage(process.pid);
  const startTime = new Date(now.getTime() - stats.elapsed);
  const elapsedMinutes = differenceInMinutes(now, startTime) + 1;
  const cacheHits = ctx.statistics.cacheHits as number;

  const upTime = distanceInWordsToNow(startTime, {locale: zhLocale});
  const hashFull = ctx.statistics.hash as string;
  const hashShort = hashFull.slice(0, 7);
  const requestCount = ctx.statistics.requestCount as number;
  const requestFrequency = Math.floor(requestCount / elapsedMinutes);
  const cacheHitRate = ((cacheHits / requestCount * 100) || 0).toFixed(2) + '%';
  const memory = `${(stats.memory / (1024 * 1024)).toFixed(2)} MB`;
  const cpu = `${stats.cpu.toFixed(2)}%`;

  ctx.set({
    'content-type': 'text/html',
  });
  ctx.body = html.replace('{{upTime}}', upTime)
      .replace('{{hashFull}}', hashFull)
      .replace('{{hashShort}}', hashShort)
      .replace('{{requestCount}}', requestCount.toString())
      .replace('{{requestFrequency}}', requestFrequency.toString())
      .replace('{{cacheHitRate}}', cacheHitRate)
      .replace('{{memory}}', memory)
      .replace('{{cpu}}', cpu);

  await next();
};

export default homepage;
