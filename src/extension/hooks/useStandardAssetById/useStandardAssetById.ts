import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectStandardAssetsUpdating,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IStandardAsset,
  INetwork,
} from '@extension/types';
import type { IUseStandardAssetByIdState } from './types';

export default function useStandardAssetById(
  id: string
): IUseStandardAssetByIdState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  const updatingStandardAssets: boolean = useSelectStandardAssetsUpdating();
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
