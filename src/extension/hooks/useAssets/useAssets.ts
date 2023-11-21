import { useEffect, useState } from 'react';

// selectors
import {
  useSelectAssets,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// types
import { IAsset, INetwork } from '@extension/types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

export default function useAssets(): IAsset[] {
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const assetItems: Record<string, IAsset[]> | null = useSelectAssets();
  const [assets, setAssets] = useState<IAsset[]>([]);

  useEffect(() => {
    let selectedAssets: IAsset[] = [];

    // if the assets have updated or the network has changed, get the new assets
    if (assetItems && selectedNetwork) {
      selectedAssets =
        assetItems[convertGenesisHashToHex(selectedNetwork.genesisHash)] || [];
    }

    setAssets(selectedAssets);
  }, [assetItems, selectedNetwork]);

  return assets;
}
