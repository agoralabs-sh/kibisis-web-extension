import { OnApplicationComplete, Transaction } from 'algosdk';

/**
 * Computes the application OnComplete intention. This function may seem unnecessary, but Algorand NoOp application
 * calls use "apan" 0. However, when decoding/encoding the transaction object, they omit this value, because it is a
 * zero(???).
 * @param {Transaction} transaction - the decoded transaction to compute
 * @returns {OnApplicationComplete | null} the application OnComplete, or null if it is an app creation or this is not
 * an application call transaction.
 */
export default function computeApplicationOnComplete(
  transaction: Transaction
): OnApplicationComplete | null {
  if (transaction.type !== 'appl') {
    return null;
  }

  // if there is no app oncomplete, it could be either a noop or creation
  if (!transaction.appOnComplete) {
    // if there is an app index, it will be a no-op
    if (transaction.appIndex) {
      return OnApplicationComplete.NoOpOC;
    }

    return null; // app creation
  }

  return transaction.appOnComplete;
}
