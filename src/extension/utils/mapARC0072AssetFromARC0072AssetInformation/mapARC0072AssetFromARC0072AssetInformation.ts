import { BigNumber } from 'bignumber.js';

// types
import { AssetTypeEnum } from '@extension/enums';

// types
import type { IARC0072Asset, IARC0072AssetInformation } from '@extension/types';

export default function mapARC0072AssetFromARC0072AssetInformation(
  appId: string,
  assetInformation: IARC0072AssetInformation,
  verified: boolean
): IARC0072Asset {
  return {
    id: appId,
    totalSupply: new BigNumber(
      String(assetInformation.totalSupply as bigint)
    ).toFixed(),
    type: AssetTypeEnum.ARC0072,
    verified,
  };
}
