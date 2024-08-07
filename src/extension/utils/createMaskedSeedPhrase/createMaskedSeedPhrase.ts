/**
 * Creates a masked seed phrase of 25, 4-character, words of asterisks.
 * @returns {string} a space separated 25, 4-character, word string of asterisks.
 */
export default function createMaskedSeedPhrase(): string {
  return Array.from({ length: 25 }, () => '****').join(' ');
}
