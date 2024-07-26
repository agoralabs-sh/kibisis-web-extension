import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from '../accounts/useSelectAccounts';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

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
      (value) => convertPublicKeyToAVMAddress(value.publicKey) === fromAddress
    ) || null
  );
}
