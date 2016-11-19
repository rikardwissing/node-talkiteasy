var config = {
  defaultOptions: {
    service: 'google',
    language: 'en-us',
    token: process.env.VOICERSS_TOKEN || "voicersstoken",
    codec: 'mp3',
    format: '48khz_16bit_stereo',
    rate: '0'
  }
};

module.exports = config;