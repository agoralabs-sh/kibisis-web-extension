import {
  Algodv2,
  makeAssetFreezeTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// Types
import { INetwork } from '@extension/types';

// Utils
import getNotPureStakeAlgodClient from './getNotPureStakeAlgodClient';

interface IOptions {
  assetId: string;
  freezeTarget: string;
  from: string;
  isFreezing: boolean;
  network: INetwork;
  note: string | null;
}

export default async function createAssetFreezeTransaction({
  assetId,
  freezeTarget,
  from,
  isFreezing,
  network,
  note,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getNotPureStakeAlgodClient(network);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  return makeAssetFreezeTxnWithSuggestedParams(
    from,
    note ? new TextEncoder().encode(note) : undefined,
    parseInt(assetId),
    freezeTarget,
    isFreezing,
    suggestedParams
  );
}
