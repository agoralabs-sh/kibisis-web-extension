import { encode as encodeBase64 } from '@stablelib/base64';
import {
  Algodv2,
  encodeUnsignedTransaction,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';

interface IOptions {
  amount: BigNumber;
  assetId: string;
  from: string;
  note: string | null;
  to: string | null;
}

export default async function createAssetTransaction({
  amount,
  assetId,
  from,
  note,
  to,
}: IOptions): Promise<string> {
  const client: Algodv2 = new Algodv2(
    '',
    'https://testnet-api.algonode.cloud',
    ''
  );
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();
  const encoder: TextEncoder = new TextEncoder();
  let transaction: Transaction;

  // for algorand transactions, we need to use payment transactions
  if (assetId === '0') {
    transaction = makePaymentTxnWithSuggestedParams(
      from,
      to || from,
      amount.toNumber(),
      undefined,
      note ? encoder.encode(note) : undefined,
      suggestedParams
    );

    return encodeBase64(encodeUnsignedTransaction(transaction));
  }

  // for all other assets, use asset transfer transactions
  transaction = makeAssetTransferTxnWithSuggestedParams(
    from,
    to || from,
    undefined,
    undefined,
    amount.toNumber(),
    note ? encoder.encode(note) : undefined,
    parseInt(assetId),
    suggestedParams
  );

  return encodeBase64(encodeUnsignedTransaction(transaction));
}
