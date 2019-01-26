import * as path from 'path';
import * as winston from 'winston';
import config from '../config';

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/all.log',
    }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
}));

export default logger;
