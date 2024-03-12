import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectAddAssetsConfirming(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.addAssets.confirming
  );
}
