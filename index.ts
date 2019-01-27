import Koa = require('koa');
import favicon = require('koa-favicon');
import morgan = require('koa-morgan');
import range = require('koa-range');
import staticCache = require('koa-static-cache');
import path = require('path');

import config from './config';
import download from './middlewares/download';
import error from './middlewares/error';
import logger from './utils/logger';

const isProduction = process.env.NODE_ENV === 'production';
const app = new Koa();

app.proxy = true;

// Handle error
app.use(error);

// HTTP console logger
app.use(morgan(isProduction ? 'short' : 'dev'));

// Favicon
app.use(favicon(path.resolve(__dirname, './assets/favicon.ico')));

// Range requests support
app.use(range);

// Download middleware
app.use(download);

app.context.files = {};
app.use(staticCache('./files', {
  maxAge: config.cacheExpire,
  buffer: false,
  gzip: true,
  usePrecompiledGzip: true,
  dynamic: true,
  preload: false,
}, app.context.files));

process.on('uncaughtException' , (err) => {
  logger.error('uncaughtException', err);
});

app.listen(config.port);

logger.info(`Running at port ${config.port}`);
