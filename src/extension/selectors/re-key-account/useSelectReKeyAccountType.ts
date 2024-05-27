import { useSelector } from 'react-redux';

// types
import type { TReKeyType } from '@extension/features/re-key-account';
import type { IMainRootState } from '@extension/types';

export default function useSelectReKeyAccountType(): TReKeyType | null {
  return useSelector<IMainRootState, TReKeyType | null>(
    ({ reKeyAccount }) => reKeyAccount.type
  );
}
