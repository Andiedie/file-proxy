import * as Koa from 'koa';
import logger from '../utils/logger';

const error: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(`Error in ${ctx.request.path}: ${err instanceof Error ? err.stack : err}`);
    ctx.status = 500;
  }
};

export default error;
