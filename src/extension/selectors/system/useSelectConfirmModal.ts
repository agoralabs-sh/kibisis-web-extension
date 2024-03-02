import { useSelector } from 'react-redux';

// features
import type { IConfirmModal } from '@extension/features/system';

// types
import type { IBaseRootState } from '@extension/types';

export default function useSelectConfirmModal(): IConfirmModal | null {
  return useSelector<IBaseRootState, IConfirmModal | null>(
    (state) => state.system.confirmModal
  );
}
