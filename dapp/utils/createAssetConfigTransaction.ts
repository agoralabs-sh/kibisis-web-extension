import {
  Algodv2,
  generateAccount,
  makeAssetConfigTxnWithSuggestedParams,
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

export default async function createAssetConfigTransaction({
  assetId,
  from,
  network,
  note,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getRandomAlgodClient(network);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();
  const [clawbackAddress, freezeAddress, managerAddress, reserveAddress] =
    Array.from({ length: 4 }, () => generateAccount().addr);

  return makeAssetConfigTxnWithSuggestedParams(
    from,
    note ? new TextEncoder().encode(note) : undefined,
    parseInt(assetId),
    managerAddress,
    reserveAddress,
    freezeAddress,
    clawbackAddress,
    suggestedParams
  );
}
