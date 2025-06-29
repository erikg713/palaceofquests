// validateRealms.test.ts

import { validateRealms } from '../utils/validateRealms'; // Adjust path as needed
import { realms } from './realms';

interface Realm {
  id: string; // or number if that's the real type
  name: string;
}

describe('validateRealms', () => {
  it('validates a correct realms dataset without throwing', () => {
    expect(() => validateRealms(realms)).not.toThrow();
  });

  it('throws for realms with missing required fields', () => {
    const missingFieldRealms = [{ id: 'abc' } as any, { name: 'Forgot ID' } as any];
    expect(() => validateRealms(missingFieldRealms)).toThrow();
  });

  it('throws for realms with incorrect types', () => {
    const invalidTypedRealms = [{ id: 123, name: 456 }];
    expect(() => validateRealms(invalidTypedRealms as any)).toThrow();
  });

  it('validates realms with additional properties (if allowed)', () => {
    const extendedRealms = [{ id: 'r1', name: 'Realm X', description: 'extra' }];
    expect(() => validateRealms(extendedRealms as any)).not.toThrow();
  });

  it('throws for an empty realm list if required', () => {
    expect(() => validateRealms([])).toThrow();
  });

  it('throws when input is not an array', () => {
    expect(() => validateRealms(null as any)).toThrow();
    expect(() => validateRealms(undefined as any)).toThrow();
    expect(() => validateRealms({} as any)).toThrow();
  });
});
