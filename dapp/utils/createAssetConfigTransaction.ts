import {
  Algodv2,
  generateAccount,
  makeAssetConfigTxnWithSuggestedParams,
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

export default async function createAssetConfigTransaction({
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
