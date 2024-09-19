import BigNumber from 'bignumber.js';

// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import type {
  IAccountInformation,
  IAlgorandAccountInformation,
} from '@extension/types';

export default function mapAVMAccountInformationToAccountInformation(
  avmAccountInformation: IAlgorandAccountInformation,
  accountInformation: IAccountInformation,
  updatedAt?: number
): IAccountInformation {
  return {
    ...accountInformation,
    atomicBalance: new BigNumber(
      String(avmAccountInformation.amount as bigint)
    ).toString(),
    authAddress: avmAccountInformation['auth-addr'] || null,
    minAtomicBalance: new BigNumber(
      String(avmAccountInformation['min-balance'] as bigint)
    ).toString(),
    standardAssetHoldings: avmAccountInformation.assets.map((value) => ({
      amount: new BigNumber(String(value.amount as bigint)).toString(),
      id: new BigNumber(String(value['asset-id'] as bigint)).toString(),
      isFrozen: value['is-frozen'],
      type: AssetTypeEnum.Standard,
    })),
    updatedAt: updatedAt || new Date().getTime(),
  };
}
