import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '../types';
export default function useSelectFetchingAccounts(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.accounts.fetching
  );
}
