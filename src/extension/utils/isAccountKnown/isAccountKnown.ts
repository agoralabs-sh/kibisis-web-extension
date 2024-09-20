// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccount } from '@extension/types';

// services
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

export default function isAccountKnown(
  accounts: IAccount[],
  address: string
): boolean {
  return (
    accounts.findIndex(
      (value) =>
        convertPublicKeyToAVMAddress(
          AccountRepository.decode(value.publicKey)
        ) === address
    ) > -1
  );
}
