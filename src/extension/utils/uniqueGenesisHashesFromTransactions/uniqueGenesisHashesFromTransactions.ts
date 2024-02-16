import { encode as encodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';

/**
 * Convenience function that extracts the unique genesis hashes from a list of transactions.
 * @param {Transaction[]} transactions - the decoded transactions.
 * @returns {string[]} the genesis hash of each transaction.
 */
export default function uniqueGenesisHashesFromTransactions(
  transactions: Transaction[]
): string[] {
  return transactions.reduce<string[]>((acc, transaction) => {
    const genesisHash: string = encodeBase64(transaction.genesisHash);

    return acc.some((value) => value === genesisHash)
      ? acc
      : [...acc, genesisHash];
  }, []);
}
