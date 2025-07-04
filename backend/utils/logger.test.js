// backend/utils/logger.test.js
const pino = require('pino');
const stream = require('stream');
const logger = require('./logger');
const logger = require('./utils/logger');

logger.info({ userId: 123, route: '/auth' }, 'User authenticated');
logger.error(new Error('DB failed'), 'Database error encountered');
describe('Logger', () => {
  let output;
  let writable;

  beforeEach(() => {
    output = '';
    writable = new stream.Writable({
      write(chunk, encoding, callback) {
        output += chunk.toString();
        callback();
      }
    });
  });

  it('logs info messages with context', (done) => {
    const testLogger = pino(writable);
    testLogger.info({ userId: 42, action: 'login' }, 'User action logged');
    setImmediate(() => {
      expect(output).toContain('User action logged');
      expect(output).toContain('"userId":42');
      expect(output).toContain('"action":"login"');
      done();
    });
  });

  it('logs error objects with stack trace', (done) => {
    const testLogger = pino(writable);
    const err = new Error('Test error');
    testLogger.error(err, 'Error occurred');
    setImmediate(() => {
      expect(output).toContain('Error occurred');
      expect(output).toContain('Test error');
      expect(output).toContain('stack');
      done();
    });
  });

  it('logs at correct levels', (done) => {
    const testLogger = pino({ level: 'warn' }, writable);
    testLogger.info('Should not log');
    testLogger.warn('Should log');
    setImmediate(() => {
      expect(output).not.toContain('Should not log');
      expect(output).toContain('Should log');
      done();
    });
  });
});
