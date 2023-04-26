import {
  Algodv2,
  makeAssetFreezeTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import randomNotPureStakeNode from './randomNotPureStakeNode';

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
  const node: INode = randomNotPureStakeNode(network);
  const client: Algodv2 = new Algodv2('', node.url, node.port);
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
