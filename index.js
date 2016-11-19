var request = require('request');
var querystring = require('querystring');

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

module.exports = function (app) {
  var module = {};

  app.get('/tts/:service/:text.:codec', function(req, res) {
    module.pipe(res, params.text, {
      service: req.params.service,
      codec: req.params.codec,
      format: req.query.f,
      rate: req.query.r,
      language: req.query.l
    });
  });

  module.getUrl = function(text, options) {
    options = defaultOptions(options);

    var qobject = getQueryObject(text, options);
    var qstring = querystring.stringify(qobject);

    if(options.service == 'google') {
      return 'http://translate.google.com/translate_tts?'+qstring;
    }

    if(options.service == 'voicerss') {
      return 'http://api.voicerss.org/?'+qstring;
    }
  };

  module.pipe = function(res, text, options) {
    options = defaultOptions(options);
    request(module.getUrl(text, options)).pipe(res);
  };

  return module;
}