import * as Koa from 'koa';
import config from '../config';

const header: Koa.Middleware = async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Cache-Control': `max-age=${config.cacheExpire}`,
  });
  await next();
};

export default header;
