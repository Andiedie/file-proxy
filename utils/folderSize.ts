import cp = require('child_process');
import logger from './logger';

export default (path: string): string => {
  try {
    const result = cp.execSync(`du -sh ${path}`).toString().trim();
    const matchResult = /^(.+?)\t/.exec(result);
    if (matchResult) {
      return matchResult[1];
    } else {
      throw new Error(`Fail to match: ${result}`);
    }
  } catch (err) {
    logger.warn(`Fail to get folder size: ${err.message}`);
  }
  return '';
};
