import fs = require('fs');
import { resolve } from 'path';
import config from '../config';
import logger from './logger';
import * as path from './path';
import * as store from './store';

// A day
const INTERVAL = 24 * 60 * 60 * 1000;

export default () => {
  const ms2NextAlarm = ms2Hour(config.cleanerAlarm);
  setTimeout(() => {
  setInterval(cleaner, INTERVAL);
}, ms2NextAlarm);
  logger.info(`File cleaner will run at ${config.cleanerAlarm}:00`);
};

async function cleaner() {
  const filenames = fs.readdirSync(path.files);
  const toBeRemoved = [];
  for (const filename of filenames) {
    if (filename === '.gitkeep') { continue; }
    const filePath = resolve(path.files, filename);
    const stat = fs.statSync(filePath);
    if (new Date().getTime() - stat.atime.getTime() > config.cacheExpire) {
      toBeRemoved.push(filename);
      logger.verbose(`${filename} expired`);
    }
  }
  for (const filename of toBeRemoved) {
    const filePath = resolve(path.files, filename);
    await store.remove(filename);
    fs.unlinkSync(filePath);
  }
  await store.remove(toBeRemoved);
  logger.info(`${toBeRemoved.length} expired files removed`);
}

function ms2Hour(hour: number) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour);
  target.setMinutes(0);
  target.setSeconds(0);
  target.setMilliseconds(0);
  if (now.getHours() >= hour) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}
