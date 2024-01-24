/**
 * Convenience function that simply checks if the phrases are empty.
 * @param {string[]} phrases - the phrases array to check.
 * @returns {boolean} true if the phrases are empty, false if at least one is not empty.
 */
export default function isPhrasesEmpty(phrases: string[]): boolean {
  return !phrases.some((value) => value.length > 0);
}
