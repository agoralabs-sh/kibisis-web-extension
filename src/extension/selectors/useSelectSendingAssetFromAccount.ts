import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from './useSelectAccounts';

// services
import AccountService from '@extension/services/AccountService';

// types
import { IAccount, IMainRootState } from '@extension/types';

export default function useSelectSendingAssetFromAccount(): IAccount | null {
  const accounts: IAccount[] = useSelectAccounts();
  const fromAddress: string | null = useSelector<IMainRootState, string | null>(
    (state) => state.sendAssets.fromAddress
  );

  if (!fromAddress) {
    return null;
  }

  return (
    accounts.find(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        fromAddress
    ) || null
  );
}
