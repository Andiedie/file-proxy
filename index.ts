import Koa = require('koa');
import favicon = require('koa-favicon');
import morgan = require('koa-morgan');
import range = require('koa-range');
import staticCache = require('koa-static-cache');
import { resolve } from 'path';

import download from './middlewares/download';
import error from './middlewares/error';
import homepage from './middlewares/homepage';
import * as statistics from './middlewares/statistics';

import config from './config';
import cleaner from './utils/cleaner';
import logger from './utils/logger';
import * as path from './utils/path';

const isProduction = process.env.NODE_ENV === 'production';
const app = new Koa();

app.proxy = true;

// Handle error
app.use(error);

// HTTP console logger
app.use(morgan(isProduction ? 'short' : 'dev'));

// Favicon
app.use(favicon(resolve(path.assets, './favicon.ico')));

// Range requests support
app.use(range);

// Home page
app.use(homepage);
app.use(statistics.middleware);

// Download middleware
app.use(download);

// Server static file
const files = {};
app.use(staticCache(path.files, {
  maxAge: config.cacheExpire,
  buffer: false,
  gzip: true,
  dynamic: true,
  preload: true,
}, files));
logger.info(`${Object.keys(files).length} files loaded`);

// Expired file cleaner
cleaner();

process.on('uncaughtException' , (err) => {
  logger.error('uncaughtException', err);
});

app.listen(config.port);

logger.info(`Running at port ${config.port}`);
