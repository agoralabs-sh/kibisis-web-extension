import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectStandardAssetsUpdating(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.standardAssets.updating
  );
}
