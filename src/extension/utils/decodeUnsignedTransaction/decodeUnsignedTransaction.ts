import {
  decodeUnsignedTransaction as algoSDKDecodeUnsignedTransaction,
  Transaction,
} from 'algosdk';

/**
 * Wrapper function around the algosdk's decodeUnsignedTransaction function.
 * This is necessary as the zero values seem to become undefined in the decode process.
 * @param {Uint8Array} encodedUnsignedTransaction - the encoded unsigned transaction.
 * @returns {algosdk.Transaction} the decoded unsigned transaction, with the required values set to zero, if undefined.
 */
export default function decodeUnsignedTransaction(
  encodedUnsignedTransaction: Uint8Array
): Transaction {
  const decodedUnsignedTransaction: Transaction =
    algoSDKDecodeUnsignedTransaction(encodedUnsignedTransaction);

  // enforce 0 if undefined
  decodedUnsignedTransaction.amount =
    decodedUnsignedTransaction.amount || BigInt(0);
  decodedUnsignedTransaction.fee = decodedUnsignedTransaction.fee || 0;

  return decodedUnsignedTransaction;
}
