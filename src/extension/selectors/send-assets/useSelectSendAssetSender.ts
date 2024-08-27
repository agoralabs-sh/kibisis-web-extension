import { useSelector } from 'react-redux';

// selectors
import useSelectAccounts from '../accounts/useSelectAccounts';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

export default function useSelectSendAssetSender(): IAccountWithExtendedProps | null {
  const accounts = useSelectAccounts();
  const sender = useSelector<IMainRootState, IAccountWithExtendedProps | null>(
    (state) => state.sendAssets.sender
  );

  if (!sender) {
    return null;
  }

  return accounts.find((value) => value.publicKey === sender.publicKey) || null;
}
