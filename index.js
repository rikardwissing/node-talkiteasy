"use strict";

const request = require('request');
const querystring = require('querystring');

let defaultOptions = (options) => {
  options = options || {};

  return {
    service: options.service || 'google',
    language: options.language || 'en-us',
    token: options.token || 'b358d0103d7642269a19753d527023e6',
    codec: options.codec || 'mp3',
    format: options.format || '48khz_16bit_stereo',
    rate: options.rate || '0'
  }
}

let reqToOptions = (req) => ({
  service: req.params.service || req.query.s,
  codec: req.params.codec || req.query.c,
  format: req.query.f,
  rate: req.query.r,
  language: req.query.l
});

let getUrl = (text, options) => options.service == 'google' ? getUrlGoogle(text, options)
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

module.exports = function (app) {
  let module = {};

  module.getUrl = (text, options) => getUrl(text, defaultOptions(options));
  module.pipe = (res, text, options) => request(module.getUrl(text, defaultOptions(options))).pipe(res);

  if(app) {
    app.get('/say/:text.:codec', (req, res) => module.pipe(res, req.params.text, reqToOptions(req)));
    app.get('/say/:text', (req, res) => module.pipe(res, req.params.text, reqToOptions(req)));
    app.get('/tts/:service/:text.:codec', (req, res) => module.pipe(res, req.params.text, reqToOptions(req)));
  }

  return module;
}