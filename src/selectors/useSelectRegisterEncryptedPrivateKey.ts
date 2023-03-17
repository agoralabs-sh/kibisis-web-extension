import { useSelector } from 'react-redux';

// Types
import { IRegistrationRootState } from '../types';

export default function useSelectRegisterEncryptedPrivateKey(): string | null {
  return useSelector<IRegistrationRootState, string | null>(
    (state) => state.register.encryptedPrivateKey
  );
}
