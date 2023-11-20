import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import {
  IAlgorandKeyRegistrationTransaction,
  IBaseTransaction,
  IKeyRegistrationOfflineTransaction,
  IKeyRegistrationOnlineTransaction,
} from '@extension/types';

export default function parseAssetFreezeTransaction(
  algorandKeyRegistrationTransaction: IAlgorandKeyRegistrationTransaction,
  baseTransaction: IBaseTransaction
): IKeyRegistrationOfflineTransaction | IKeyRegistrationOnlineTransaction {
  if (
    algorandKeyRegistrationTransaction['selection-participation-key'] &&
    algorandKeyRegistrationTransaction['vote-first-valid'] &&
    algorandKeyRegistrationTransaction['vote-key-dilution'] &&
    algorandKeyRegistrationTransaction['vote-last-valid'] &&
    algorandKeyRegistrationTransaction['vote-participation-key']
  ) {
    return {
      ...baseTransaction,
      selectionParticipationKey:
        algorandKeyRegistrationTransaction['selection-participation-key'],
      voteFirstValid: new BigNumber(
        String(algorandKeyRegistrationTransaction['vote-first-valid'] as bigint)
      ).toString(),
      voteKeyDilution: new BigNumber(
        String(
          algorandKeyRegistrationTransaction['vote-key-dilution'] as bigint
        )
      ).toString(),
      voteLastValid: new BigNumber(
        String(algorandKeyRegistrationTransaction['vote-last-valid'] as bigint)
      ).toString(),
      voteParticipationKey:
        algorandKeyRegistrationTransaction['vote-participation-key'],
      type: TransactionTypeEnum.KeyRegistrationOnline,
    };
  }

  return {
    ...baseTransaction,
    type: TransactionTypeEnum.KeyRegistrationOffline,
  };
}
