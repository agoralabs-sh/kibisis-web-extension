import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectSavingAccounts(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.accounts.saving);
}
