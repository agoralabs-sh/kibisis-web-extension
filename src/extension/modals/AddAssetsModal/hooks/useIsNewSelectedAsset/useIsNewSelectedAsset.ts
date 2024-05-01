import { useEffect, useState } from 'react';

// enums
import { AssetTypeEnum } from '@extension/enums';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
} from '@extension/selectors';

// types
import type { IAssetTypes } from '@extension/types';

export default function useIsNewSelectedAsset(
  asset: IAssetTypes | null
): boolean {
  // selectors
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  // state
  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    switch (asset?.type) {
      case AssetTypeEnum.ARC0200:
        setIsNew(!!arc0200Assets.find((value) => value.id === asset.id));
        break;
      case AssetTypeEnum.Standard:
        setIsNew(!!standardAssets.find((value) => value.id === asset.id));
        break;
      default:
        break;
    }
  }, [asset]);

  return isNew;
}
