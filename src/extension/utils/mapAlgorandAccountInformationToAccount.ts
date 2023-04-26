import { BigNumber } from 'bignumber.js';

// Types
import { IAccount, IAlgorandAccountInformation } from '@extension/types';

export default function mapAlgorandAccountInformationToAccount(
  algorandAccountInformation: IAlgorandAccountInformation,
  account: IAccount,
  updatedAt?: number
): IAccount {
  return {
    address: account.address,
    atomicBalance: new BigNumber(
      String(algorandAccountInformation.amount as bigint)
    ).toString(),
    assets: algorandAccountInformation.assets.map((value) => ({
      amount: new BigNumber(String(value.amount as bigint)).toString(),
      id: new BigNumber(String(value['asset-id'] as bigint)).toString(),
      isFrozen: value['is-frozen'],
    })),
    authAddress: algorandAccountInformation['auth-addr'] || null,
    createdAt: account.createdAt,
    genesisHash: account.genesisHash,
    id: account.id,
    minAtomicBalance: new BigNumber(
      String(algorandAccountInformation['min-balance'] as bigint)
    ).toString(),
    name: account.name,
    updatedAt: updatedAt || new Date().getTime(),
  };
}
