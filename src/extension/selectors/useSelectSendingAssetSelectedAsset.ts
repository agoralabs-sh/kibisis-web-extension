import { useSelector } from 'react-redux';

// types
import { IAssetTypes, INativeCurrency, IMainRootState } from '@extension/types';

export default function useSelectSendingAssetSelectedAsset():
  | IAssetTypes
  | INativeCurrency
  | null {
  return useSelector<IMainRootState, IAssetTypes | INativeCurrency | null>(
    (state) => state.sendAssets.selectedAsset
  );
}
