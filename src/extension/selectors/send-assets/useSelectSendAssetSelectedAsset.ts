import { useSelector } from 'react-redux';

// types
import { IAssetTypes, INativeCurrency, IMainRootState } from '@extension/types';

export default function useSelectSendAssetSelectedAsset():
  | IAssetTypes
  | INativeCurrency
  | null {
  return useSelector<IMainRootState, IAssetTypes | INativeCurrency | null>(
    (state) => state.sendAssets.selectedAsset
  );
}
