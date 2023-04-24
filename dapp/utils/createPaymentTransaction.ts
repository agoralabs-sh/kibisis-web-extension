import {
  Algodv2,
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
  from: string;
  network: INetwork;
  note: string | null;
  to: string | null;
}

export default async function createPaymentTransaction({
  amount,
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

  return makePaymentTxnWithSuggestedParams(
    from,
    to || from,
    amount.toNumber(),
    undefined,
    note ? encoder.encode(note) : undefined,
    suggestedParams
  );
}
