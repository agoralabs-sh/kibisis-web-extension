import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// features
import { updateAssetInformationThunk } from '@extension/features/assets';

// hooks
import useAssets from '@extension/hooks/useAssets';

// selectors
import {
  useSelectSelectedNetwork,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// types
import { IAppThunkDispatch, IAsset, INetwork } from '@extension/types';
import { IUseAssetState } from './types';

export default function useAsset(assetId: string): IUseAssetState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const updatingAssets: boolean = useSelectUpdatingAssets();
  //hooks
  const assets: IAsset[] = useAssets();
  // state
  const [asset, setAsset] = useState<IAsset | null>(null);

  // fetch unknown asset information
  useEffect(() => {
    const selectedAsset: IAsset | null =
      assets.find((value) => value.id === assetId) || null;

    if (selectedAsset) {
      setAsset(selectedAsset);

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
  }, [assets]);

  return {
    asset,
    updating: updatingAssets,
  };
}
