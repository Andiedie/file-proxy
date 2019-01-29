import * as path from 'path';
import * as winston from 'winston';
import config from '../config';
import root from './root';

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.resolve(root, './logs/error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.resolve(root, '../logs/combined.log'),
    }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  level: process.env.NODE_ENV !== 'production' ? 'info' : 'debug',
}));

export default logger;
