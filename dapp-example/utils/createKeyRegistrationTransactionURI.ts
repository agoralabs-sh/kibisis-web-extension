import {
  decode as decodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { TransactionType } from 'algosdk';

// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { INetwork } from '@extension/types';

interface IOptions {
  from: string;
  network: INetwork;
  note?: string;
  type?: 'offline' | 'online';
}

export default async function createKeyRegistrationTransactionURI({
  from,
  network,
  note,
  type = 'online',
}: IOptions): Promise<string> {
  const genesisHash = encodeBase64URLSafe(decodeBase64(network.genesisHash));
  let encodedNote: string | undefined;
  let numRounds: number;

  if (note) {
    encodedNote = encodeBase64URLSafe(new TextEncoder().encode(note));
  }

  if (type === 'offline') {
    return `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Transaction}/${
      ARC0300PathEnum.Send
    }?${new URLSearchParams({
      [ARC0300QueryEnum.GenesisHash]: genesisHash,
      [ARC0300QueryEnum.Sender]: from,
      [ARC0300QueryEnum.Type]: TransactionType.keyreg,
      ...(encodedNote && {
        [ARC0300QueryEnum.Note]: encodedNote,
      }),
    }).toString()}`;
  }

  numRounds = 1e5; // sets up keys for 100000 rounds

  return `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Transaction}/${
    ARC0300PathEnum.Send
  }?${new URLSearchParams({
    [ARC0300QueryEnum.GenesisHash]: genesisHash,
    [ARC0300QueryEnum.SelectionKey]: encodeBase64URLSafe(
      decodeBase64('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=')
    ),
    [ARC0300QueryEnum.StateProofKey]: encodeBase64URLSafe(
      decodeBase64(
        'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
      )
    ),
    [ARC0300QueryEnum.Sender]: from,
    [ARC0300QueryEnum.Type]: TransactionType.keyreg,
    [ARC0300QueryEnum.VoteFirst]: '0',
    [ARC0300QueryEnum.VoteKey]: encodeBase64URLSafe(
      decodeBase64('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=')
    ),
    [ARC0300QueryEnum.VoteKeyDilution]: Math.round(numRounds ** 0.5).toString(), // dilution default is sqrt num rounds
    [ARC0300QueryEnum.VoteLast]: numRounds.toString(),
    ...(encodedNote && {
      [ARC0300QueryEnum.Note]: encodedNote,
    }),
  }).toString()}`;
}
