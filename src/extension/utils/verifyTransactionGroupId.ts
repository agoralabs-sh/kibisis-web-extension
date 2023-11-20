import { Transaction } from 'algosdk';
import { encode as encodeBase64 } from '@stablelib/base64';

// utils
import { computeGroupId } from '@common/utils';

/**
 * Verifies that a group of transactions has valid assigned group IDs. Each group ID must match each other and they
 * must match the computed group ID, i.e. the group ID that would be assigned if the group property is undefined and the
 * list of transactions are passed through {@link https://algorand.github.io/js-algorand-sdk/functions/assignGroupID.html algosdk.assignGroupID}
 * NOTE: if the transactions only contain 1 transaction, the group ID of that transaction must be undefined, otherwise,
 * the list of transaction is invalid.
 * @param {Transaction[]} transactions
 * @returns {boolean} true if the transaction group ids are valid, false otherwise.
 */
export default function verifyTransactionGroupId(
  transactions: Transaction[]
): boolean {
  let firstTransactionGroupId: Uint8Array | undefined;
  let computedGroupId: Uint8Array;

  if (transactions.length <= 0) {
    return false;
  }

  firstTransactionGroupId = transactions[0].group;

  // a group of one transaction, must have an empty group
  if (transactions.length === 1 && !firstTransactionGroupId) {
    return true;
  }

  // get the computed group id
  computedGroupId = computeGroupId(transactions);

  // check all group ids match as well as the "naked" computed group id
  return transactions.every(
    (value) =>
      value.group && // invalid if the group is undefined
      firstTransactionGroupId && // invalid if the first group id is invalid
      encodeBase64(value.group) === encodeBase64(firstTransactionGroupId) && // invalid the group ids do not match the first group id
      encodeBase64(value.group) === encodeBase64(computedGroupId) // invalid if the assigned group id does not match the computed one
  );
}
