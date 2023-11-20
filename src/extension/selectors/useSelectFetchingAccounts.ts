import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectFetchingAccounts(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.accounts.fetching
  );
}
