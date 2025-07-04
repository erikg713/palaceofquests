const logger = require('./logger');

describe('Logger', () => {
  it('should log info without throwing', () => {
    expect(() => logger.info('Test info log')).not.toThrow();
  });

  it('should log error objects without throwing', () => {
    expect(() => logger.error({ err: new Error('fail') }, 'Failed')).not.toThrow();
  });
});
