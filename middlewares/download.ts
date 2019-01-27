import fs = require('fs');
import Koa = require('koa');
import _ = require('lodash');
import path = require('path');

import logger from '../utils/logger';
import md5 from '../utils/md5';
import { request, requestProxy } from '../utils/request';
import * as store from '../utils/store';

const download: Koa.Middleware = async (ctx, next) => {
  const originUrl = decodeURIComponent(ctx.path.substr(1));
  const filename = md5(originUrl);
  ctx.path = `/${filename}`;

  await next();

  if (ctx.status !== 404) {
    const file = await store.get(filename);
    if (file) {
      logger.debug('Set content-type');
      ctx.set({
        'content-type': file.mimeType,
      });
    }
    return;
  }
  logger.debug(`Download file ${originUrl}`);
  const r = ctx.query.proxy ? requestProxy : request;
  let result: any;
  try {
    result = await r.get(originUrl);
    let mimeType = '';
    if (result.headers) {
      const headers = _.mapKeys(result.headers, (value, key) => {
        return key.toLowerCase();
      });
      mimeType = headers['content-type'];
    }
    const filePath = path.resolve(__dirname, '../files', filename);
    fs.writeFileSync(filePath, result.body);
    await store.set({
      origin: originUrl,
      path: filename,
      mimeType,
    });
    ctx.status = result.statusCode;
    ctx.body = result.body;
    ctx.set({
      'content-type': mimeType,
    });
  } catch (err) {
    logger.warn(err.message);
    ctx.status = 403;
    ctx.body = err.message;
  }
};

export default download;
