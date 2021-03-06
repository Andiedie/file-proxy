import crypto = require('crypto');

export default function md5(input: string) {
  return crypto.createHash('md5')
    .update(input)
    .digest('hex');
}
