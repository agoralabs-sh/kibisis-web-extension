import {
  Algodv2,
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
}: IOptions): Promise<Transaction> {
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
    return makePaymentTxnWithSuggestedParams(
      from,
      to || from,
      amount.toNumber(),
      undefined,
      note ? encoder.encode(note) : undefined,
      suggestedParams
    );
  }

  // for all other assets, use asset transfer transactions
  return makeAssetTransferTxnWithSuggestedParams(
    from,
    to || from,
    undefined,
    undefined,
    amount.toNumber(),
    note ? encoder.encode(note) : undefined,
    parseInt(assetId),
    suggestedParams
  );
}
