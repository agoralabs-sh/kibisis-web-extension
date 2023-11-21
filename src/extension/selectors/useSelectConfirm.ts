import { useSelector } from 'react-redux';

// features
import { IConfirm } from '@extension/features/system';

// types
import { IBaseRootState } from '@extension/types';

export default function useSelectConfirm(): IConfirm | null {
  return useSelector<IBaseRootState, IConfirm | null>(
    (state) => state.system.confirm
  );
}
