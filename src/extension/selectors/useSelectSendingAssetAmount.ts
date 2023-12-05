import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendingAssetAmount(): string {
  return useSelector<IMainRootState, string>(
    (state) => state.sendAssets.amount
  );
}
