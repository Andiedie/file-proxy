import * as Koa from 'koa';
import conditionalGet = require('koa-conditional-get');
import etag = require('koa-etag');
import * as favicon from 'koa-favicon';
import * as morgan from 'koa-morgan';
import * as path from 'path';

import config from '../config';
import errorHandler from '../utils/errorHandler';
import logger from '../utils/logger';

const isProduction = process.env.NODE_ENV === 'production';
const app = new Koa();

app.proxy = true;

// handle error
app.use(errorHandler);

// http console logger
app.use(morgan(isProduction ? 'short' : 'dev'));

// conditional get using etag
app.use(conditionalGet());
app.use(etag());

// favicon
app.use(favicon(path.resolve(__dirname, '../assets/favicon.ico')));

process.on('uncaughtException' , (err) => {
  logger.error('uncaughtException', err);
});

app.listen(config.port);

logger.info(`Running at port ${config.port}`);
