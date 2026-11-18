// src/utils/validateRealms.js
//
// Validates a realms array: every realm needs a string `id` and a string
// `name`; extra fields are harmless. Throws on non-arrays, empty arrays,
// missing fields, or wrong types. (The stricter per-realm shape check used
// by the game data lives in src/data/realms.jsx.)

/**
 * @param {unknown} realms
 * @throws {Error} when the array is missing, empty, or any realm is invalid
 */
export function validateRealms(realms) {
  if (!Array.isArray(realms)) {
    throw new Error('validateRealms: expected an array of realms.');
  }
  if (realms.length === 0) {
    throw new Error('validateRealms: realms array must not be empty.');
  }
  for (const realm of realms) {
    if (!realm || typeof realm !== 'object') {
      throw new Error('validateRealms: each realm must be an object.');
    }
    if (typeof realm.id !== 'string' || realm.id.length === 0) {
      throw new Error('validateRealms: each realm needs a string id.');
    }
    if (typeof realm.name !== 'string' || realm.name.length === 0) {
      throw new Error('validateRealms: each realm needs a string name.');
    }
  }
}

export default validateRealms;
