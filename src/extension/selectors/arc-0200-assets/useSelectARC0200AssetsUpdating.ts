import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectARC0200AssetsUpdating(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.arc200Assets.updating
  );
}
