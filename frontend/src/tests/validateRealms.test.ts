// frontend/src/tests/validateRealms.test.ts

import { validateRealms } from '../utils/validateRealms'; // Update path if needed

// Mock data for test coverage
const validRealms = [
  { id: '1', name: 'Earth' },
  { id: '2', name: 'Mars' },
];

const realmsMissingFields = [
  { id: '3' },        // Missing name
  { name: 'Venus' },  // Missing id
];

const realmsWrongTypes = [
  { id: 4, name: 123 },
];

const realmsWithExtraFields = [
  { id: '5', name: 'Jupiter', description: 'Gas giant' },
];

describe('validateRealms', () => {
  it('accepts a valid array of realms', () => {
    expect(() => validateRealms(validRealms)).not.toThrow();
  });

  it('throws if any realm is missing required fields', () => {
    expect(() => validateRealms(realmsMissingFields)).toThrow();
  });

  it('throws if any realm has incorrect types', () => {
    expect(() => validateRealms(realmsWrongTypes as any)).toThrow();
  });

  it('accepts realms with extra but harmless properties', () => {
    expect(() => validateRealms(realmsWithExtraFields as any)).not.toThrow();
  });

  it('throws on empty array (if not allowed by validator)', () => {
    expect(() => validateRealms([])).toThrow();
  });

  it('throws on non-array input', () => {
    expect(() => validateRealms(null as any)).toThrow();
    expect(() => validateRealms(undefined as any)).toThrow();
    expect(() => validateRealms({} as any)).toThrow();
  });
});
