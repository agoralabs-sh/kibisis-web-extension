import { useSelector } from 'react-redux';

// Types
import { IRegistrationRootState } from '@extension/types';

export default function useSelectRegistrationEncryptedPrivateKey():
  | string
  | null {
  return useSelector<IRegistrationRootState, string | null>(
    (state) => state.registration.encryptedPrivateKey
  );
}
