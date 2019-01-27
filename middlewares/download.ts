import fs = require('fs');
import Koa = require('koa');
import path = require('path');
import url = require('url');

import { RequestError } from 'request-promise-native/errors';
import logger from '../utils/logger';
import md5 from '../utils/md5';
import { request, requestProxy } from '../utils/request';

const download: Koa.Middleware = async (ctx, next) => {
  const originUrl = decodeURIComponent(ctx.path.substr(1));
  const ext = path.parse(url.parse(originUrl).pathname || '').ext;
  const filename = md5(originUrl) + ext;
  ctx.path = `/${filename}`;

  await next();

  if (ctx.status !== 404) { return; }
  const r = ctx.query.proxy ? requestProxy : request;
  let result: any;
  try {
    result = await r.get(originUrl);
    ctx.status = result.statusCode;
    ctx.body = result.body;
    ctx.set({
      'content-type': result.headers['content-type'],
    });
  } catch (err) {
    logger.warn(err.message);
    ctx.status = 403;
    ctx.body = err.message;
  }
};

export default download;
