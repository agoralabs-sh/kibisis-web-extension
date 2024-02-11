import { BigNumber } from 'bignumber.js';

// types
import { AssetTypeEnum } from '@extension/enums';

// types
import { IARC0200Asset, IARC0200AssetInformation } from '@extension/types';

export default function mapARC0200AssetFromARC200AssetInformation(
  appId: string,
  assetInformation: IARC0200AssetInformation,
  iconUrl: string | null,
  verified: boolean
): IARC0200Asset {
  return {
    decimals: new BigNumber(
      String(assetInformation.decimals as bigint)
    ).toNumber(),
    iconUrl,
    id: appId,
    name: assetInformation.name,
    symbol: assetInformation.symbol,
    totalSupply: new BigNumber(
      String(assetInformation.totalSupply as bigint)
    ).toString(),
    type: AssetTypeEnum.ARC0200,
    verified,
  };
}
