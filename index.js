var request = require('request');
var querystring = require('querystring');

var defaultOptions = function(options) {
  options = options || {};

  options.service = options.service || "google";
  options.language = options.language || "sv-se";
  options.token = options.token || 'b358d0103d7642269a19753d527023e6';
  options.codec = options.codec || "mp3";
  options.format = options.format || "48khz_16bit_stereo";
  options.rate = options.rate || "0";

  return options;
}

var getQueryObject = function(text, options) {
  if(options.service == 'google') {
    return {
      q: text,
      tl: options.language,
      ie: 'UTF-8',
      client: 'tw-ob'
    };
  }

  if(options.service == 'voicerss') {
    return {
      key: options.token,
      src: text, 
      hl: options.language,
      f: options.format,
      r: options.rate,
      c: options.codec
    };
  }
}

var getUrl = function(text, options) {
  options = defaultOptions(options);

  var qobject = getQueryObject(text, options);
  var qstring = querystring.stringify(qobject);

  if(options.service == 'google') {
    return 'http://translate.google.com/translate_tts?'+qstring;
  }

  if(options.service == 'voicerss') {
    return 'http://api.voicerss.org/?'+qstring;
  }
}

var reqToOptions = function(req){
  return {
    service: req.params.service || req.query.s,
    codec: req.params.codec || req.query.c,
    format: req.query.f,
    rate: req.query.r,
    language: req.query.l
  }
}

module.exports = function (app) {
  var module = {};

  module.getUrl = function(text, options) {
    return getUrl(text, options);
  };

  module.pipe = function(res, text, options) {
    options = defaultOptions(options);
    request(module.getUrl(text, options)).pipe(res);
  };

  if(app) {
    app.get('/say/:text.:codec', function(req, res) {
      module.pipe(res, req.params.text, reqToOptions(req));
    });

    app.get('/say/:text', function(req, res) {
      module.pipe(res, req.params.text, reqToOptions(req));
    });

    app.get('/tts/:service/:text.:codec', function(req, res) {
      module.pipe(res, req.params.text, reqToOptions(req));
    });
  }

  return module;
}