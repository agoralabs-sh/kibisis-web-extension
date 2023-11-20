import {
  Algodv2,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';

// types
import { INetwork } from '@extension/types';

// utils
import getNotPureStakeAlgodClient from './getNotPureStakeAlgodClient';

interface IOptions {
  amount: BigNumber;
  assetId: string;
  from: string;
  network: INetwork;
  note: string | null;
  to: string | null;
}

export default async function createAssetTransferTransaction({
  amount,
  assetId,
  from,
  network,
  note,
  to,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getNotPureStakeAlgodClient(network);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();
  const encoder: TextEncoder = new TextEncoder();

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
