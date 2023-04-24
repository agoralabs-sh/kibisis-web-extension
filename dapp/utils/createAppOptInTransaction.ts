import {
  Algodv2,
  makeApplicationOptInTxn,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// Constants
import { TESTNET_APP_INDEX } from '../constants';

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import randomNotPureStakeNode from './randomNotPureStakeNode';

interface IOptions {
  from: string;
  network: INetwork;
  note: string | null;
}

export default async function createAppOptInTransaction({
  from,
  network,
  note,
}: IOptions): Promise<Transaction> {
  const node: INode = randomNotPureStakeNode(network);
  const client: Algodv2 = new Algodv2('', node.url, node.port);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();
  const encoder: TextEncoder = new TextEncoder();

  return makeApplicationOptInTxn(
    from,
    suggestedParams,
    parseInt(TESTNET_APP_INDEX),
    [Uint8Array.from([0]), Uint8Array.from([0, 1])],
    undefined,
    undefined,
    undefined,
    note ? encoder.encode(note) : undefined
  );
}
