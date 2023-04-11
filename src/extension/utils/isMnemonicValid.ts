import { mnemonicToSecretKey } from 'algosdk';

/**
 * Convenience function that checks whether a 25-word mnemonic is valid.
 * @param {string} mnemonic - a 25-word mnemonic separated by whitespace.
 * @returns {boolean} true if the mnemonic is valid, false otherwise.
 */
export default function isMnemonicValid(mnemonic: string): boolean {
  try {
    mnemonicToSecretKey(mnemonic);

    return true;
  } catch (error) {
    return false;
  }
}
