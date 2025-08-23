require('dotenv').config();

module.exports = {
  api: {
    key: process.env.NOUS_API_KEY,
    baseUrl: process.env.NOUS_API_BASE_URL,
    model: process.env.MODEL_NAME || 'Hermes-3-Llama-3.1-405B'
  },
  timing: {
    minInterval: parseInt(process.env.REQUEST_INTERVAL_MIN) || 1,
    maxInterval: parseInt(process.env.REQUEST_INTERVAL_MAX) || 7
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  requestLimits: {
    min: parseInt(process.env.REQUEST_LIMIT_MIN) || 50,
    max: parseInt(process.env.REQUEST_LIMIT_MAX) || 100,
  }
};
