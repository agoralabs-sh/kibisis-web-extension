/**
 * Utility function that checks if a string is digits only.
 * @param {string} input - the string to check.
 * @returns {boolean} true if the string is numeric, false if it contains characters that are not 0-9.
 */
export default function isNumericString(input: string): boolean {
  return new RegExp(/^\d+$/).test(input);
}
