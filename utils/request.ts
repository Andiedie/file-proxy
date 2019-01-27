import rp = require('request-promise-native');
import config from '../config';

const options: rp.RequestPromiseOptions = {
  headers: {
    'User-Agent': config.ua,
  },
  // response.body is buffer
  encoding: null,
  // resolve full response instead of body
  resolveWithFullResponse: true,
  // get a rejection only if the request failed for technical reasons
  simple: false,
};

export const request = rp.defaults({
  ...options,
  proxy: null,
});

export const requestProxy = rp.defaults({
  ...options,
  proxy: config.proxy,
});
