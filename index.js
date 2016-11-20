"use strict";

var config = require('./config');

const extend = require('extend');
const request = require('request');
const querystring = require('querystring');


let defaultOptions = (options) => extend(config.defaultOptions, options);
let reqToOptions = (req) => extend(req.params, req.query, req.body);

let getUrl = (text, options) => 
    options.service == 'google' ? getUrlGoogle(text, options)
  : options.service == 'voicerss' ? getUrlVoiceRSS(text, options)
  : '';

let getUrlGoogle = (text, options) => 'http://translate.google.com/translate_tts?'+querystring.stringify(getQueryObjectGoogle(text, options));
let getUrlVoiceRSS = (text, options) => 'http://api.voicerss.org/?'+querystring.stringify(getQueryObjectVoiceRSS(text, options));

let getQueryObjectGoogle = (text, options) => ({
  q: text,
  tl: options.language,
  ie: 'UTF-8',
  client: 'tw-ob'
});

let getQueryObjectVoiceRSS = (text, options) => ({
  key: options.token,
  src: text, 
  hl: options.language,
  f: options.format,
  r: options.rate,
  c: options.codec
});

module.exports = {
  getUrl: (text, options) => getUrl(text, defaultOptions(options)),
  pipe: (res, text, options) => request(module.getUrl(text, defaultOptions(options))).pipe(res)
}