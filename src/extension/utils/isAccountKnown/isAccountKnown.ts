// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

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
          PrivateKeyService.decode(value.publicKey)
        ) === address
    ) > -1
  );
}
