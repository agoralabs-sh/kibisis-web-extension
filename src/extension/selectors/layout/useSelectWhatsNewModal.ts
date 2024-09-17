import { useSelector } from 'react-redux';

// types
import type { IBaseRootState } from '@extension/types';

export default function useSelectWhatsNewModal(): boolean {
  return useSelector<IBaseRootState, boolean>(
    (state) => state.layout.whatsNewModal
  );
}
