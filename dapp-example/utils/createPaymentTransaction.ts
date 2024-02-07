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
  to: string | null;
}

export default async function createPaymentTransaction({
  amount,
  from,
  network,
  note,
  to,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getRandomAlgodClient(network);
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  // return makePaymentTxnWithSuggestedParams(
  //   from,
  //   to || from,
  //   amount.toNumber(),
  //   undefined,
  //   note ? new TextEncoder().encode(note) : undefined,
  //   suggestedParams
  // );

  return makePaymentTxnWithSuggestedParams(
    from,
    to || from,
    0,
    undefined,
    note ? new TextEncoder().encode(note) : undefined,
    {
      ...suggestedParams,
      firstRound: 1,
      lastRound: 1,
      fee: 0,
      flatFee: true,
    }
  );
}
