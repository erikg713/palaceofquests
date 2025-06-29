import { realms } from './realms';

describe('validateRealms', () => {
  it('should not throw an error for valid realms', () => {
    expect(() => validateRealms(realms)).not.toThrow();
  });

  it('should throw an error for invalid realm data', () => {
    const invalidRealms = [
      { id: 123, name: 'Invalid Realm' }, // Invalid types
    ];
    expect(() => validateRealms(invalidRealms)).toThrow();
  });
});
