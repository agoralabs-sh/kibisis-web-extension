import {
  Algodv2,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import randomNotPureStakeNode from './randomNotPureStakeNode';

interface IOptions {
  amount: BigNumber;
  assetId: string;
  from: string;
  network: INetwork;
  note: string | null;
  to: string | null;
}

export default async function createAssetTransaction({
  amount,
  assetId,
  from,
  network,
  note,
  to,
}: IOptions): Promise<Transaction> {
  const node: INode = randomNotPureStakeNode(network);
  const client: Algodv2 = new Algodv2('', node.url, node.port);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();
  const encoder: TextEncoder = new TextEncoder();

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
