import finder = require('find-package-json');
import { dirname, resolve } from 'path';

const packageJsonPath = finder(__dirname).next().filename;

if (!packageJsonPath) {
  throw new Error('Fail to determine root path');
}

export const root = dirname(packageJsonPath);

export const files = resolve(root, './files');

export const logs = resolve(root, './logs');

export const assets = resolve(root, './assets');
