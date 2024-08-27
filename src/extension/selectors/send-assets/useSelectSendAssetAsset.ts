import { useSelector } from 'react-redux';

// types
import type {
  IAssetTypes,
  INativeCurrency,
  IMainRootState,
} from '@extension/types';

export default function useSelectSendAssetAsset():
  | IAssetTypes
  | INativeCurrency
  | null {
  return useSelector<IMainRootState, IAssetTypes | INativeCurrency | null>(
    (state) => state.sendAssets.asset
  );
}
