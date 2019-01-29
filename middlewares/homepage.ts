import * as fs from 'fs';
import * as Koa from 'koa';
import * as path from 'path';
import root from '../utils/root';
import { getStatistics } from './statistics';

const html = fs.readFileSync(path.resolve(root, './assets/index.html')).toString();

const homepage: Koa.Middleware = async (ctx, next) => {
  if (ctx.path !== '/') {
    return next();
  }

  ctx.set({
    'Content-Type': 'text/html',
  });

  const s = await getStatistics();
  ctx.body = html.replace('{{upTime}}', s.upTime)
      .replace('{{hashFull}}', s.hashFull)
      .replace('{{hashShort}}', s.hashShort)
      .replace('{{requestCount}}', s.requestCount.toString())
      .replace('{{requestFrequency}}', s.requestPerHour.toString())
      .replace('{{cacheFileCount}}', s.cacheFileCount.toString())
      .replace('{{cacheFileSize}}', s.cacheFileSize)
      .replace('{{cacheHitRate}}', s.cacheHitRate)
      .replace('{{memory}}', s.memory)
      .replace('{{cpu}}', s.cpu);

  await next();
};

export default homepage;
