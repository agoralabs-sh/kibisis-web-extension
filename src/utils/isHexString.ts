/**
 * Checks if a string is hexadecimal.
 * @param {string} input -  the string to check.
 * @returns {boolean} true if the string is hexadecimal, false otherwise.
 */
export default function isHexString(input: string): boolean {
  return /^[A-F0-9]+$/i.test(input);
}
