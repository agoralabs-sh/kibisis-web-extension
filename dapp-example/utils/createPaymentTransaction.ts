import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
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
  from: string;
  network: INetwork;
  note: string | null;
  suggestedParams?: SuggestedParams;
  to: string | null;
}

export default async function createPaymentTransaction({
  amount,
  from,
  network,
  note,
  suggestedParams,
  to,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getRandomAlgodClient(network);
  let _suggestedParams: SuggestedParams =
    suggestedParams || (await client.getTransactionParams().do());

  return makePaymentTxnWithSuggestedParams(
    from,
    to || from,
    amount.toNumber(),
    undefined,
    note ? new TextEncoder().encode(note) : undefined,
    _suggestedParams
  );
}
