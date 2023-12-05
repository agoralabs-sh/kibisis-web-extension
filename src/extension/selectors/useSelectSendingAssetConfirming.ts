import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectSendingAssetConfirming(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.sendAssets.confirming
  );
}
