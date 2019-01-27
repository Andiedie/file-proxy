import cp = require('child_process');

export default () => {
  return cp.execSync('git rev-parse HEAD').toString().trim();
};
