import {
  makeKeyRegistrationTxnWithSuggestedParamsFromObject,
  type Transaction,
} from 'algosdk';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type { IOptions } from './types';

/**
 * Convenience function that creates a key registration transaction from a URI schema.
 * @param {IOptions} options - the fields needed to create the transaction.
 * @returns {Promise<Transaction>} a promise that resolves to an unsigned key registration transaction.
 */
export default async function createUnsignedKeyRegistrationTransactionFromSchema({
  logger,
  network,
  nodeID,
  schema,
}: IOptions): Promise<Transaction> {
  const networkClient = new NetworkClient({ logger, network });
  const suggestedParams = await networkClient.suggestedParams(nodeID);

  return makeKeyRegistrationTxnWithSuggestedParamsFromObject({
    from: schema.query[ARC0300QueryEnum.Sender],
    suggestedParams: {
      ...suggestedParams,
      ...(schema.query[ARC0300QueryEnum.Fee] && {
        fee: parseInt(schema.query[ARC0300QueryEnum.Fee]),
      }),
      ...(schema.query[ARC0300QueryEnum.FirstValid] && {
        firstValid: parseInt(schema.query[ARC0300QueryEnum.FirstValid]),
      }),
      ...(schema.query[ARC0300QueryEnum.LastValid] && {
        lastValid: parseInt(schema.query[ARC0300QueryEnum.LastValid]),
      }),
    },
    ...(schema.query[ARC0300QueryEnum.Group] && {
      group: schema.query[ARC0300QueryEnum.Group],
    }),
    ...(schema.query[ARC0300QueryEnum.Lease] && {
      lease: schema.query[ARC0300QueryEnum.Lease],
    }),
    ...(schema.query[ARC0300QueryEnum.Note] && {
      note: new TextEncoder().encode(schema.query[ARC0300QueryEnum.Note]),
    }),
    ...(schema.query[ARC0300QueryEnum.ReyKeyTo] && {
      rekeyTo: schema.query[ARC0300QueryEnum.ReyKeyTo],
    }),
    ...(schema.query[ARC0300QueryEnum.SelectionKey] && {
      selectionKey: schema.query[ARC0300QueryEnum.SelectionKey],
    }),
    ...(schema.query[ARC0300QueryEnum.StateProofKey] && {
      stateProofKey: schema.query[ARC0300QueryEnum.StateProofKey],
    }),
    ...(schema.query[ARC0300QueryEnum.VoteFirst] && {
      voteFirst: parseInt(schema.query[ARC0300QueryEnum.VoteFirst]),
    }),
    ...(schema.query[ARC0300QueryEnum.VoteKey] && {
      voteKey: schema.query[ARC0300QueryEnum.VoteKey],
    }),
    ...(schema.query[ARC0300QueryEnum.VoteKeyDilution] && {
      voteKeyDilution: parseInt(schema.query[ARC0300QueryEnum.VoteKeyDilution]),
    }),
    ...(schema.query[ARC0300QueryEnum.VoteLast] && {
      voteLast: parseInt(schema.query[ARC0300QueryEnum.VoteLast]),
    }),
  });
}
