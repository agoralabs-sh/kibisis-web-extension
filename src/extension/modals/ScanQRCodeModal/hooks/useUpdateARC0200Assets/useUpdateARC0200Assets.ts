import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// features
import { updateARC0200AssetInformationThunk } from '@extension/features/arc200-assets';

// selectors
import { useSelectARC0200Assets } from '@extension/selectors';

// types
import type { IAppThunkDispatch, IARC0200Asset } from '@extension/types';
import type {
  IUseUpdateARC0200AssetsOptions,
  IUseUpdateARC0200AssetsState,
} from './types';

// utils
import selectAssetsForNetwork from '@extension/utils/selectAssetsForNetwork';

export default function useUpdateARC0200Assets({
  assetIDs,
  network,
}: IUseUpdateARC0200AssetsOptions): IUseUpdateARC0200AssetsState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const arc0200Assets: Record<string, IARC0200Asset[]> | null =
    useSelectARC0200Assets();
  // states
  const [assets, setAssets] = useState<IARC0200Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const reset = () => {
    setAssets([]);
    setLoading(false);
  };

  useEffect(() => {
    let arc0200AssetsForNetwork: IARC0200Asset[] | null;

    if (network) {
      arc0200AssetsForNetwork = selectAssetsForNetwork(
        arc0200Assets,
        network.genesisHash
      );

      if (arc0200AssetsForNetwork) {
        (async () => {
          const unknownAssets: string[] = [];
          let knownAssets: IARC0200Asset[] = [];

          setLoading(true);

          // iterate all the assets to add, and check if they are known arc-0200 assets
          assetIDs.forEach((appId) => {
            const asset: IARC0200Asset | null =
              assets.find((value) => value.id === appId) || null;

            // if the asset is known added
            if (asset) {
              return knownAssets.push(asset);
            }

            // ...otherwise, we need to check the network if it is an arc-0200
            return unknownAssets.push(appId);
          });

          // for the unknown assets, attempt to fetch their information, if they are not arc-0200 they will be filtered out
          const { arc200Assets: newAssets } = await dispatch(
            updateARC0200AssetInformationThunk({
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
