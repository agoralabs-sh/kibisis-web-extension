import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// features
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// selectors
import { useSelectStandardAssets } from '@extension/selectors';

// types
import type { IAppThunkDispatch, IStandardAsset } from '@extension/types';
import type {
  IUseUpdateStandardAssetsOptions,
  IUseUpdateStandardAssetsState,
} from './types';

// utils
import selectAssetsForNetwork from '@extension/utils/selectAssetsForNetwork';

export default function useUpdateStandardAssets({
  assetIDs,
  network,
}: IUseUpdateStandardAssetsOptions): IUseUpdateStandardAssetsState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const standardAssets: Record<string, IStandardAsset[]> | null =
    useSelectStandardAssets();
  // states
  const [assets, setAssets] = useState<IStandardAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const reset = () => {
    setAssets([]);
    setLoading(false);
  };

  useEffect(() => {
    let standardAssetsForNetwork: IStandardAsset[] | null;

    if (network) {
      standardAssetsForNetwork = selectAssetsForNetwork(
        standardAssets,
        network.genesisHash
      );

      if (standardAssetsForNetwork) {
        (async () => {
          const unknownAssets: string[] = [];
          let knownAssets: IStandardAsset[] = [];

          setLoading(true);

          // iterate all the assets to add, and check if they are known assets
          assetIDs.forEach((assetId) => {
            const asset: IStandardAsset | null =
              standardAssetsForNetwork?.find((value) => value.id === assetId) ||
              null;

            // if the asset is known added
            if (asset) {
              return knownAssets.push(asset);
            }

            // ...otherwise, we need to check the network
            return unknownAssets.push(assetId);
          });

          // for the unknown assets, fetch their information
          const { standardAssets: newAssets } = await dispatch(
            updateStandardAssetInformationThunk({
              ids: unknownAssets,
              network,
            })
          ).unwrap();
          knownAssets = [...knownAssets, ...newAssets];

          setAssets(knownAssets);
          setLoading(false);
        })();
      }
    }
  }, []);

  return {
    assets,
    loading,
    reset,
  };
}
