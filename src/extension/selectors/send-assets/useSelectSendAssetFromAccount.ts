import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from '../accounts/useSelectAccounts';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

export default function useSelectSendAssetFromAccount(): IAccountWithExtendedProps | null {
  const accounts = useSelectAccounts();
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
