import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendingAssetAmount(): string | null {
  return useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.amount
  );
}
