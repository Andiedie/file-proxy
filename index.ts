import Koa = require('koa');
import conditionalGet = require('koa-conditional-get');
import etag = require('koa-etag');
import favicon = require('koa-favicon');
import morgan = require('koa-morgan');
import range = require('koa-range');
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

// Conditional GET using etag
app.use(conditionalGet());
app.use(etag());

// Favicon
app.use(favicon(path.resolve(__dirname, './assets/favicon.ico')));

// Range requests support
app.use(range);

// Download middleware
app.use(download);

process.on('uncaughtException' , (err) => {
  logger.error('uncaughtException', err);
});

app.listen(config.port);

logger.info(`Running at port ${config.port}`);
