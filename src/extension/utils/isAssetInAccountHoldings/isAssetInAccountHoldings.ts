// enums
import { AssetTypeEnum } from '@extension/enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccountInformation } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function to check if a particular asset is in held by an account.
 * @param {IOptions} options - contains information about the account, the asset and the network.
 * @returns {boolean} true if the asset is in the account holdings, false if the network is not recognized or the asset
 * is not in the account holdings.
 */
export default function isAssetInAccountHoldings({
  account,
  asset,
  network,
}: IOptions): boolean {
  const accountInformation: IAccountInformation | null =
    AccountRepository.extractAccountInformationForNetwork(account, network);

  if (!accountInformation) {
    return false;
  }

  switch (asset.type) {
    case AssetTypeEnum.ARC0200:
      return !!accountInformation.arc200AssetHoldings.find(
        (value) => value.id === asset.id
      );
    case AssetTypeEnum.Standard:
      return !!accountInformation.standardAssetHoldings.find(
        (value) => value.id === asset.id
      );
    default:
      return false;
  }
}
