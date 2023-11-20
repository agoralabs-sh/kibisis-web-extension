import { BigNumber } from 'bignumber.js';

// types
import {
  IAccountInformation,
  IAlgorandAccountInformation,
} from '@extension/types';

export default function mapAlgorandAccountInformationToAccountInformation(
  algorandAccountInformation: IAlgorandAccountInformation,
  accountInformation: IAccountInformation,
  updatedAt?: number
): IAccountInformation {
  return {
    ...accountInformation,
    atomicBalance: new BigNumber(
      String(algorandAccountInformation.amount as bigint)
    ).toString(),
    assetHoldings: algorandAccountInformation.assets.map((value) => ({
      amount: new BigNumber(String(value.amount as bigint)).toString(),
      id: new BigNumber(String(value['asset-id'] as bigint)).toString(),
      isFrozen: value['is-frozen'],
    })),
    authAddress: algorandAccountInformation['auth-addr'] || null,
    minAtomicBalance: new BigNumber(
      String(algorandAccountInformation['min-balance'] as bigint)
    ).toString(),
    updatedAt: updatedAt || new Date().getTime(),
  };
}
