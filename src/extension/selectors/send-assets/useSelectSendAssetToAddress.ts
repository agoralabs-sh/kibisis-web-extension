import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendAssetToAddress(): string | null {
  return useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.toAddress
  );
}
