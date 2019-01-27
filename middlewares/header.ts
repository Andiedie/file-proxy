import * as Koa from 'koa';

const header: Koa.Middleware = async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
  });
  await next();
};

export default header;
