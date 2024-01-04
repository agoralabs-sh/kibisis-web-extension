// services
import AccountService from '@extension/services/AccountService';

// types
import { IAccount } from '@extension/types';

export default function isAccountKnown(
  accounts: IAccount[],
  address: string
): boolean {
  return (
    accounts.findIndex(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        address
    ) > -1
  );
}
