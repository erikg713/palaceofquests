// backend/utils/logger.js
const pino = require('pino');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  formatters: {
    level(label) {
      return { level: label };
    },
    log(obj) {
      // Automatically serialize errors
      if (obj instanceof Error) {
        return {
          msg: obj.message,
          stack: obj.stack,
          ...obj
        };
      }
      return obj;
    }
  },
  transport: !isProd
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' }
      }
    : undefined,
  ...(isProd && {
    // Write logs to a rotating file in production
    destination: path.join(__dirname, '../../logs/app.log')
  })
});

module.exports = logger;
