import {
  Algodv2,
  makeAssetDestroyTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import randomNotPureStakeNode from './randomNotPureStakeNode';

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
  const node: INode = randomNotPureStakeNode(network);
  const client: Algodv2 = new Algodv2('', node.url, node.port);
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
