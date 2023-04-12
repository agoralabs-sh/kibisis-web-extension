import { useSelector } from 'react-redux';

// Features
import { IConfirm } from '@extension/features/application';

// Types
import { IBaseRootState } from '@extension/types';

export default function useSelectConfirm(): IConfirm | null {
  return useSelector<IBaseRootState, IConfirm | null>(
    (state) => state.application.confirm
  );
}
