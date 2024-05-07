// types
import { AssetTypeEnum } from '@extension/enums';

// types
import type { IARC0200Asset, IARC0200AssetInformation } from '@extension/types';

export default function mapARC0200AssetFromARC200AssetInformation(
  appId: string,
  assetInformation: IARC0200AssetInformation,
  iconUrl: string | null,
  verified: boolean
): IARC0200Asset {
  return {
    decimals: assetInformation.decimals,
    iconUrl,
    id: appId,
    name: assetInformation.name,
    symbol: assetInformation.symbol,
    totalSupply: assetInformation.totalSupply,
    type: AssetTypeEnum.ARC0200,
    verified,
  };
}
