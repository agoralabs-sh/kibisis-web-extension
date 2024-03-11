import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from '../accounts/useSelectAccounts';

// types
import { IAccount, IMainRootState } from '@extension/types';

export default function useSelectAddAssetsAccount(): IAccount | null {
  const accounts: IAccount[] = useSelectAccounts();
  const accountId: string | null = useSelector<IMainRootState, string | null>(
    (state) => state.addAssets.accountId
  );

  if (!accountId) {
    return null;
  }

  return accounts.find((value) => value.id === accountId) || null;
}
