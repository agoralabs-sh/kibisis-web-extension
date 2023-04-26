import {
  computeGroupID as algoComputeGroupID,
  decodeUnsignedTransaction,
  encodeUnsignedTransaction,
  Transaction,
} from 'algosdk';

/**
 * Utility function to compute the group ID for a list of transactions. This function ignores the current group ID for
 * each and computes the group ID based an unassigned group ID.
 * @param {Transaction[]} transactions - the group of transactions to compute.
 * @returns {Uint8Array} the raw computed group ID.
 */
export default function computeGroupId(
  transactions: Transaction[]
): Uint8Array {
  return algoComputeGroupID(
    transactions.map((value: Transaction) => {
      const newTransaction: Transaction = decodeUnsignedTransaction(
        encodeUnsignedTransaction(value)
      ); // de/re-serialize the transaction object to deep "copy" it.

      // reset the transaction ids, so they can be computed, otherwise the computed id will include the previous group id
      newTransaction.group = undefined;

      return newTransaction;
    })
  );
}
