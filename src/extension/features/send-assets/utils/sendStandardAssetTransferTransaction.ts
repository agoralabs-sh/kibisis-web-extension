import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
  IntDecoding,
  waitForConfirmation,
} from 'algosdk';

// types
import { IBaseOptions } from '@common/types';
import {
  IAlgorandPendingTransactionResponse,
  IStandardAsset,
} from '@extension/types';

interface IOptions extends IBaseOptions {
  algodClient: Algodv2;
  amount: string;
  asset: IStandardAsset;
  fromAddress: string;
  note: string | null;
  privateKey: Uint8Array;
  suggestedParams: SuggestedParams;
  toAddress: string;
}

/**
 * Convenience function that creates a payment transaction or an asset transfer transaction based on the asset ID.
 * If the asset ID is 0, we can assume this the native currency, so we use a payment transaction.
 * @param {IOptions} options - the fields needed to create a transaction
 * @returns {Transaction} an Algorand transaction ready to be signed.
 */
export default async function sendStandardAssetTransferTransaction({
  algodClient,
  amount,
  asset,
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

  // assets with an id of 0, are native currency, so we use a payment transaction
  if (asset.id === '0') {
    unsignedTransaction = makePaymentTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      BigInt(amount),
      undefined,
      encodedNote,
      suggestedParams
    );
  } else {
    unsignedTransaction = makeAssetTransferTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      undefined,
      undefined,
      BigInt(amount),
      encodedNote,
      parseInt(asset.id),
      suggestedParams
    );
  }

  signedTransactionData = unsignedTransaction.signTxn(privateKey);

  logger &&
    logger.debug(
      `${sendStandardAssetTransferTransaction.name}: sending asset "${asset.type}" transfer transaction to network`
    );

  sentRawTransaction = await algodClient
    .sendRawTransaction(signedTransactionData)
    .setIntDecoding(IntDecoding.BIGINT)
    .do();

  logger &&
    logger.debug(
      `${sendStandardAssetTransferTransaction.name}: transaction "${sentRawTransaction.txId}" sent to the network, confirming`
    );

  transactionResponse = (await waitForConfirmation(
    algodClient,
    sentRawTransaction.txId,
    4
  )) as IAlgorandPendingTransactionResponse;

  logger &&
    logger.debug(
      `${sendStandardAssetTransferTransaction.name}: transaction "${sentRawTransaction.txId}" confirmed in round "${transactionResponse['confirmed-round']}"`
    );

  // on success, return the transaction id
  return sentRawTransaction.txId;
}
