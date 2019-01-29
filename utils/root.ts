import path = require('path');

if (!require.main || !process.mainModule) {
  throw new Error('Cannot determine root path');
}

const root = path.dirname(require.main.filename || process.mainModule.filename);

export default root;
