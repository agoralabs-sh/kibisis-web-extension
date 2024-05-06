/**
 * Checks the equality of two bytes arrays.
 * @param {Uint8Array} a - the first bytes array.
 * @param {Uint8Array} b - the second byte array.
 * @returns {boolean} true if the byte arrays are equal, false otherwise.
 */
export default function isByteArrayEqual(
  a: Uint8Array,
  b: Uint8Array
): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
