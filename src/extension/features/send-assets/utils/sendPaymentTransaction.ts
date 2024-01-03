import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
  IntDecoding,
  waitForConfirmation,
} from 'algosdk';

// constants
import { TRANSACTION_CONFIRMATION_ROUNDS } from '@extension/constants';

// types
import { IBaseOptions } from '@common/types';
import { IAlgorandPendingTransactionResponse } from '@extension/types';

interface IOptions extends IBaseOptions {
  algodClient: Algodv2;
  amount: string;
  fromAddress: string;
  note: string | null;
  privateKey: Uint8Array;
  suggestedParams: SuggestedParams;
  toAddress: string;
}

/**
 * Convenience function that creates a payment transaction.
 * @param {IOptions} options - the fields needed to create a transaction
 * @returns {Transaction} an Algorand transaction ready to be signed.
 */
export default async function sendPaymentTransaction({
  algodClient,
  amount,
  fromAddress,
  logger,
  note,
  privateKey,
  suggestedParams,
  toAddress,
}: IOptions): Promise<string> {
  let encodedNote: Uint8Array | undefined;
  let encoder: TextEncoder;
  let sentRawTransaction: { txId: string };
  let signedTransactionData: Uint8Array;
  let transactionResponse: IAlgorandPendingTransactionResponse;
  let unsignedTransaction: Transaction;

  if (note) {
    encoder = new TextEncoder();
    encodedNote = encoder.encode(note);
  }

  unsignedTransaction = makePaymentTxnWithSuggestedParams(
    fromAddress,
    toAddress,
    BigInt(amount),
    undefined,
    encodedNote,
    suggestedParams
  );

  signedTransactionData = unsignedTransaction.signTxn(privateKey);

  logger &&
    logger.debug(
      `${sendPaymentTransaction.name}: sending native currency (payment) transaction to network`
    );

  sentRawTransaction = await algodClient
    .sendRawTransaction(signedTransactionData)
    .setIntDecoding(IntDecoding.BIGINT)
    .do();

  logger &&
    logger.debug(
      `${sendPaymentTransaction.name}: transaction "${sentRawTransaction.txId}" sent to the network, confirming`
    );

  transactionResponse = (await waitForConfirmation(
    algodClient,
    sentRawTransaction.txId,
    TRANSACTION_CONFIRMATION_ROUNDS
  )) as IAlgorandPendingTransactionResponse;

  logger &&
    logger.debug(
      `${sendPaymentTransaction.name}: transaction "${sentRawTransaction.txId}" confirmed in round "${transactionResponse['confirmed-round']}"`
    );

  // on success, return the transaction id
  return sentRawTransaction.txId;
}
