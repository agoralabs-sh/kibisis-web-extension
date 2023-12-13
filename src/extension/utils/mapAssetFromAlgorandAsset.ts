import { BigNumber } from 'bignumber.js';

// types
import { IAlgorandAsset, IStandardAsset } from '@extension/types';

export default function mapAssetFromAlgorandAsset(
  algorandAsset: IAlgorandAsset,
  iconUrl: string | null,
  verified: boolean
): IStandardAsset {
  return {
    clawbackAddress: algorandAsset.params.clawback || null,
    creator: algorandAsset.params.creator,
    decimals: new BigNumber(
      String(algorandAsset.params.decimals as bigint)
    ).toNumber(),
    defaultFrozen: algorandAsset.params['default-frozen'] || false,
    deleted: algorandAsset.deleted || false,
    freezeAddress: algorandAsset.params.freeze || null,
    iconUrl,
    id: new BigNumber(String(algorandAsset.index as bigint)).toString(),
    managerAddress: algorandAsset.params.manager || null,
    metadataHash: algorandAsset.params['metadata-hash'] || null,
    name: algorandAsset.params.name || null,
    nameBase64: algorandAsset.params['name-b64'] || null,
    reserveAddress: algorandAsset.params.reserve || null,
    total: new BigNumber(
      String(algorandAsset.params.total as bigint)
    ).toString(),
    unitName: algorandAsset.params['unit-name'] || null,
    unitNameBase64: algorandAsset.params['unit-name-b64'] || null,
    url: algorandAsset.params.url || null,
    urlBase64: algorandAsset.params['url-b64'] || null,
    verified,
  };
}
