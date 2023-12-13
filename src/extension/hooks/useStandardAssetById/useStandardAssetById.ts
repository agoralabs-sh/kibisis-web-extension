import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// features
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectUpdatingStandardAssets,
} from '@extension/selectors';

// types
import { IAppThunkDispatch, IAsset, INetwork } from '@extension/types';
import { IUseStandardAssetByIdState } from './types';

export default function useStandardAssetById(
  id: string
): IUseStandardAssetByIdState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const standardAssets: IAsset[] = useSelectStandardAssetsBySelectedNetwork();
  const updatingStandardAssets: boolean = useSelectUpdatingStandardAssets();
  // state
  const [standardAsset, setStandardAsset] = useState<IAsset | null>(null);

  // fetch unknown asset information
  useEffect(() => {
    const selectedAsset: IAsset | null =
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
