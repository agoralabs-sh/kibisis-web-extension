import {
  Algodv2,
  makeAssetDestroyTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// types
import { INetwork } from '@extension/types';

// utils
import getRandomAlgodClient from './getRandomAlgodClient';

interface IOptions {
  assetId: string;
  from: string;
  network: INetwork;
  note: string | null;
}

export default async function createAssetDestroyTransaction({
  assetId,
  from,
  network,
  note,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getRandomAlgodClient(network);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  return makeAssetDestroyTxnWithSuggestedParams(
    from,
    note ? new TextEncoder().encode(note) : undefined,
    parseInt(assetId),
    suggestedParams
  );
}
