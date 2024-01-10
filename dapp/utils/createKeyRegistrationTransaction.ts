import {
  Algodv2,
  makeKeyRegistrationTxnWithSuggestedParamsFromObject,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// types
import { INetwork } from '@extension/types';

// utils
import getRandomAlgodClient from './getRandomAlgodClient';

interface IOptions {
  from: string;
  network: INetwork;
  note: string | null;
  online: boolean;
}

export default async function createKeyRegistrationTransaction({
  from,
  network,
  note: rawNote,
  online,
}: IOptions): Promise<Transaction> {
  const client: Algodv2 = getRandomAlgodClient(network);
  const note: Uint8Array | undefined = rawNote
    ? new TextEncoder().encode(rawNote)
    : undefined;
  const numRounds: number = 1e5; // sets up keys for 100000 rounds
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  if (online) {
    return makeKeyRegistrationTxnWithSuggestedParamsFromObject({
      from,
      note,
      selectionKey: 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=',
      stateProofKey:
        'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==',
      suggestedParams,
      voteKey: 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=',
      voteKeyDilution: numRounds ** 0.5, // dilution default is sqrt num rounds
      voteFirst: suggestedParams.firstRound,
      voteLast: suggestedParams.firstRound + numRounds,
    });
  }

  return makeKeyRegistrationTxnWithSuggestedParamsFromObject({
    from,
    nonParticipation: true,
    note,
    suggestedParams,
  });
}
