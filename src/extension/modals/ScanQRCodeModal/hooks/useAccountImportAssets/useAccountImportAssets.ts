import { useEffect, useState } from 'react';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// selectors
import { useSelectARC0200AssetsBySelectedNetwork } from '@extension/selectors';

// types
import type {
  IARC0200Asset,
  IARC0300AccountImportSchema,
} from '@extension/types';
import type { IUseAccountImportAssets } from './types';

export default function useAccountImportAssets(
  schema: IARC0300AccountImportSchema
): IUseAccountImportAssets {
  // selectors
  const arc0200Assets: IARC0200Asset[] =
    useSelectARC0200AssetsBySelectedNetwork();
  // states
  const [assets, setAssets] = useState<IARC0200Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const _assets: IARC0200Asset[] = [];

      // iterate all the assets to add, and check if they are the types of assets that can be added
      for (const appId of schema.query[ARC0300QueryEnum.Asset]) {
        const asset: IARC0200Asset | null =
          arc0200Assets.find((value) => value.id === appId) || null;

        if (asset) {
          _assets.push(asset);

          continue;
        }

        // TODO: attempt to fetch the asset
      }

      setAssets(_assets);
    })();
  }, [schema]);

  return {
    assets,
    loading,
  };
}
