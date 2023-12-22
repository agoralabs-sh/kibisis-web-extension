import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from './useSelectAccounts';

// types
import { IAccount, IMainRootState } from '@extension/types';

export default function useSelectAddAssetAccount(): IAccount | null {
  const accounts: IAccount[] = useSelectAccounts();
  const accountId: string | null = useSelector<IMainRootState, string | null>(
    (state) => state.addAsset.accountId
  );

  if (!accountId) {
    return null;
  }

  return accounts.find((value) => value.id === accountId) || null;
}
