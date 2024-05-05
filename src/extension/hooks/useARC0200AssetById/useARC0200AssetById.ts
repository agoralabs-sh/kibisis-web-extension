import { useEffect, useState } from 'react';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectARC0200AssetsUpdating,
} from '@extension/selectors';

// types
import type { IARC0200Asset } from '@extension/types';
import type { IState } from './types';

export default function useARC0200AssetById(id: string): IState {
  // selectors
  const assets = useSelectARC0200AssetsBySelectedNetwork();
  const updating: boolean = useSelectARC0200AssetsUpdating();
  // state
  const [asset, setAsset] = useState<IARC0200Asset | null>(null);

  useEffect(() => {
    const _asset = assets.find((value) => value.id === id) || null;

    setAsset(_asset);
  }, [assets]);

  return {
    asset,
    updating,
  };
}
