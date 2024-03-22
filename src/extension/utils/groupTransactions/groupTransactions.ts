import { Transaction } from 'algosdk';
import { encode as encodeBase64 } from '@stablelib/base64';

/**
 * Convenience function to iterate over a flat array of transactions and groups them into a two-dimensional array where
 * each element is a group of transactions. An element can be a group of atomic transactions, or a single transaction.
 * @param {Transaction[]} transactions - a flat array of multiple transactions
 * @returns {Transaction[][]} a two-dimensional array containing groups of atomic/single transactions
 */
export default function groupTransactions(
  transactions: Transaction[]
): Transaction[][] {
  return transactions.reduce<Transaction[][]>((acc, currentValue) => {
    let previousGroupIndex: number;

    // undefined groups are single transactions, add them to their own group
    if (!currentValue.group) {
      return [...acc, [currentValue]];
    }

    // check if there is a previous group
    previousGroupIndex = acc.findIndex((value) =>
      value[0]?.group && currentValue.group
        ? encodeBase64(value[0].group) === encodeBase64(currentValue.group)
        : false
    );

    // if there is no previous index, and it has a group, it must be a new transaction group
    if (previousGroupIndex < 0) {
      return [...acc, [currentValue]];
    }

    // if there is a previous group, append the transaction to the group
    return acc.map((value, index) =>
      previousGroupIndex === index ? [...value, currentValue] : value
    );
  }, []);
}
