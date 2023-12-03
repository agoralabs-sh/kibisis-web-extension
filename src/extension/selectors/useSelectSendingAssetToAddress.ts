import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendingAssetToAddress(): string | null {
  return useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.toAddress
  );
}
