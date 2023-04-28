import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';

// Types
import { INetwork } from '@extension/types';

// Utils
import getNotPureStakeAlgodClient from './getNotPureStakeAlgodClient';

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
  const client: Algodv2 = getNotPureStakeAlgodClient(network);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  return makePaymentTxnWithSuggestedParams(
    from,
    to || from,
    amount.toNumber(),
    undefined,
    note ? new TextEncoder().encode(note) : undefined,
    suggestedParams
  );
}
