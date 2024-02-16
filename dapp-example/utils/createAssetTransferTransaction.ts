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
import getRandomAlgodClient from './getRandomAlgodClient';

interface IOptions {
  amount: BigNumber;
  assetId: string;
  from: string;
  network: INetwork;
  note: string | null;
  suggestedParams?: SuggestedParams;
  to: string | null;
}

export default async function createAssetTransferTransaction({
  amount,
  assetId,
  from,
  network,
  note,
  suggestedParams,
  to,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getRandomAlgodClient(network);
  const _suggestedParams: SuggestedParams =
    suggestedParams || (await client.getTransactionParams().do());
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
    _suggestedParams
  );
}
