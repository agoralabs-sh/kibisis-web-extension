import { Transaction } from 'algosdk';
import { encode as encodeBase64 } from '@stablelib/base64';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import groupTransactions from '@extension/utils/groupTransactions';

/**
 * Verifies that a flat list of transactions meets the conditions of ARC-0001. Each transaction is iterated and then
 * grouped into either a single transaction or atomic transactions and then checks if:
 * * a single transaction has no group defined
 * * a group of atomic transactions' assigned ID must match a computed ID of the transactions
 * @param {Transaction[]} transactions
 * @returns {boolean} true if the transactions are valid, false otherwise.
 * @see {@link https://arc.algorand.foundation/ARCs/arc-0001#group-validation}
 */
export default function verifyTransactionGroups(
  transactions: Transaction[]
): boolean {
  let groupsOfTransactions: Transaction[][];

  if (transactions.length <= 0) {
    return false;
  }

  groupsOfTransactions = groupTransactions(transactions);

  // verify each transaction group satisfies the arc-0001 conditions
  return groupsOfTransactions
    .reduce<boolean[]>((acc, currentValue) => {
      let computedEncodedGroupId: string;

      // if a transaction group has a length of 1, it is a single transaction and the group id is optional
      if (currentValue.length <= 1) {
        return [...acc, true];
      }

      // compute the group of transactions to ensure every transaction is present
      computedEncodedGroupId = encodeBase64(computeGroupId(currentValue));

      return [
        ...acc,
        // check that each transaction is the same as the computed transaction
        currentValue.every(
          (value) =>
            value.group && encodeBase64(value.group) === computedEncodedGroupId
        ),
      ];
    }, [])
    .every((value) => value);
}
