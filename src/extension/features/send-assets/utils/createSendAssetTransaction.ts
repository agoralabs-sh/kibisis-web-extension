import {
  makePaymentTxnWithSuggestedParams,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// types
import { IAsset } from '@extension/types';

interface IOptions {
  amount: string;
  asset: IAsset;
  fromAddress: string;
  note: string | null;
  suggestedParams: SuggestedParams;
  toAddress: string;
}

/**
 * Convenience function that creates a payment transaction or an asset transfer transaction based on the asset ID.
 * If the asset ID is 0, we can assume this the native currency, so we use a payment transaction.
 * @param {IOptions} options - the fields needed to create a transaction
 * @returns {Transaction} an Algorand transaction ready to be signed.
 */
export default function createSendAssetTransaction({
  amount,
  asset,
  fromAddress,
  note,
  suggestedParams,
  toAddress,
}: IOptions): Transaction {
  let encodedNote: Uint8Array | undefined;
  let encoder: TextEncoder;

  if (note) {
    encoder = new TextEncoder();
    encodedNote = encoder.encode(note);
  }

  // assets with an id of 0, are native currency, so we use a payment transaction
  if (asset.id === '0') {
    return makePaymentTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      BigInt(amount),
      undefined,
      encodedNote,
      suggestedParams
    );
  }

  return makeAssetTransferTxnWithSuggestedParams(
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
