import { BigNumber } from 'bignumber.js';

// types
import { AssetTypeEnum } from '@extension/enums';

// types
import { IArc200Asset, IArc200AssetInformation } from '@extension/types';

export default function mapArc200AssetFromArc200AssetInformation(
  appId: string,
  assetInformation: IArc200AssetInformation,
  iconUrl: string | null,
  verified: boolean
): IArc200Asset {
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
    type: AssetTypeEnum.Arc200,
    verified,
  };
}
