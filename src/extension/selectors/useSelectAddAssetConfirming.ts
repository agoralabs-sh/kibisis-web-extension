import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectAddAssetConfirming(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.addAsset.confirming
  );
}
