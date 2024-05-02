import { TransactionType } from 'algosdk';
import {
  decodeURLSafe as decodeBase64URLSafe,
  encode as encodeBase64,
} from '@stablelib/base64';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import isNumericString from '@extension/utils/isNumericString';
import parseARC0300CommonTransactionSendQuery from './parseARC0300CommonTransactionSendQuery';

export default function parseARC0300KeyRegistrationTransactionSendSchema(
  scheme: string,
  paths: string[],
  searchParams: URLSearchParams,
  options: IOptions
):
  | IARC0300OfflineKeyRegistrationTransactionSendSchema
  | IARC0300OnlineKeyRegistrationTransactionSendSchema
  | null {
  const _functionName = 'parseARC0300KeyRegistrationTransactionSendSchema';
  const logger = options?.logger;
  const commonQuery = parseARC0300CommonTransactionSendQuery(
    searchParams,
    options
  );
  const selectionKeyParam = searchParams.get(ARC0300QueryEnum.SelectionKey);
  const stateProofKeyParam = searchParams.get(ARC0300QueryEnum.StateProofKey);
  const voteFirstParam = searchParams.get(ARC0300QueryEnum.VoteFirst);
  const voteKeyParam = searchParams.get(ARC0300QueryEnum.VoteKey);
  const voteKeyDilutionParam = searchParams.get(
    ARC0300QueryEnum.VoteKeyDilution
  );
  const voteLastParam = searchParams.get(ARC0300QueryEnum.VoteLast);

  // check the common queries were correctly parsed
  if (!commonQuery) {
    return null;
  }

  // if the schema does not contain any participation key-related fields, we can assume it is an offline key registration transaction
  if (
    !selectionKeyParam &&
    !stateProofKeyParam &&
    !voteFirstParam &&
    !voteKeyParam &&
    !voteKeyDilutionParam &&
    !voteLastParam
  ) {
    return {
      authority: ARC0300AuthorityEnum.Transaction,
      paths: [ARC0300PathEnum.Send],
      query: {
        ...commonQuery,
        [ARC0300QueryEnum.Type]: TransactionType.keyreg,
      },
      scheme,
    };
  }

  if (!selectionKeyParam) {
    logger?.debug(`${_functionName}: "selectionkey" param not found`);

    return null;
  }

  if (!stateProofKeyParam) {
    logger?.debug(`${_functionName}: "stateproofkey" param not found`);

    return null;
  }

  if (!voteFirstParam || !isNumericString(voteFirstParam)) {
    logger?.debug(
      `${_functionName}: "votefirst" param is not found or not valid`
    );

    return null;
  }

  if (!voteKeyParam) {
    logger?.debug(`${_functionName}: "votekey" param is not found`);

    return null;
  }

  if (!voteKeyDilutionParam || !isNumericString(voteKeyDilutionParam)) {
    logger?.debug(
      `${_functionName}: "votekeydilution" param is not found or not valid`
    );

    return null;
  }

  if (!voteLastParam || !isNumericString(voteLastParam)) {
    logger?.debug(
      `${_functionName}: "votelast" param is not found or not valid`
    );

    return null;
  }

  // otherwise, it is an online key registration transaction
  return {
    authority: ARC0300AuthorityEnum.Transaction,
    paths: [ARC0300PathEnum.Send],
    query: {
      ...commonQuery,
      [ARC0300QueryEnum.SelectionKey]: encodeBase64(
        decodeBase64URLSafe(selectionKeyParam)
      ),
      [ARC0300QueryEnum.StateProofKey]: encodeBase64(
        decodeBase64URLSafe(stateProofKeyParam)
      ),
      [ARC0300QueryEnum.VoteFirst]: voteFirstParam,
      [ARC0300QueryEnum.VoteKey]: encodeBase64(
        decodeBase64URLSafe(voteKeyParam)
      ),
      [ARC0300QueryEnum.VoteKeyDilution]: voteKeyDilutionParam,
      [ARC0300QueryEnum.VoteLast]: voteLastParam,
      [ARC0300QueryEnum.Type]: TransactionType.keyreg,
    },
    scheme,
  };
}
