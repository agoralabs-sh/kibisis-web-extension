import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from '../accounts/useSelectAccounts';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

export default function useSelectAddAssetsAccount(): IAccountWithExtendedProps | null {
  const accounts = useSelectAccounts();
  const accountId: string | null = useSelector<IMainRootState, string | null>(
    (state) => state.addAssets.accountId
  );

  if (!accountId) {
    return null;
  }

  return accounts.find((value) => value.id === accountId) || null;
}
