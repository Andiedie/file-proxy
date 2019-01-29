import finder = require('find-package-json');
import path = require('path');

const packageJsonPath = finder(__dirname).next().filename;

if (!packageJsonPath) {
  throw new Error('Fail to determine root path');
}

const root = path.dirname(packageJsonPath);

export default root;
