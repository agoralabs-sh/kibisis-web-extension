import { BigNumber } from 'bignumber.js';

// Types
import { IAlgorandAsset, IAsset } from '@extension/types';

export default function mapAssetFromAlgorandAsset(
  value: IAlgorandAsset
): IAsset {
  return {
    clawbackAddress: value.params.clawback || null,
    creator: value.params.creator,
    decimals: new BigNumber(String(value.params.decimals as bigint)).toNumber(),
    defaultFrozen: value.params['default-frozen'] || false,
    deleted: value.deleted || false,
    freezeAddress: value.params.freeze || null,
    id: new BigNumber(String(value.index as bigint)).toString(),
    managerAddress: value.params.manager || null,
    metadataHash: value.params['metadata-hash'] || null,
    name: value.params.name || null,
    nameBase64: value.params['name-b64'] || null,
    reserveAddress: value.params.reserve || null,
    total: new BigNumber(String(value.params.total as bigint)).toString(),
    unitName: value.params['unit-name'] || null,
    unitNameBase64: value.params['unit-name-b64'] || null,
    url: value.params.url || null,
    urlBase64: value.params['url-b64'] || null,
  };
}
