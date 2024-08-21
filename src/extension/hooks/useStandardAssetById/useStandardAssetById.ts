import { useEffect, useState } from 'react';

// selectors
import {
  useSelectSettingsSelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectStandardAssetsUpdating,
} from '@extension/selectors';

// types
import type { IStandardAsset } from '@extension/types';
import type { IUseStandardAssetByIdState } from './types';

export default function useStandardAssetById(
  id: string
): IUseStandardAssetByIdState {
  // selectors
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const updatingStandardAssets = useSelectStandardAssetsUpdating();
  // state
  const [standardAsset, setStandardAsset] = useState<IStandardAsset | null>(
    null
  );

  // fetch unknown asset information
  useEffect(() => {
    const selectedAsset: IStandardAsset | null =
      standardAssets.find((value) => value.id === id) || null;

    if (selectedAsset) {
      setStandardAsset(selectedAsset);

      return;
    }

    // if we don't have the asset, get the asset information
    if (selectedNetwork) {
      // dispatch(
      //   updateAssetInformationThunk({
      //     ids: [assetId],
      //     network: selectedNetwork,
      //   })
      // );
    }
  }, [standardAssets]);

  return {
    standardAsset,
    updating: updatingStandardAssets,
  };
}
