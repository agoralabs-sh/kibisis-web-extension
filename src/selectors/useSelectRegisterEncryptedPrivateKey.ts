import { useSelector } from 'react-redux';

// Types
import { IRootState } from '../types';

export default function useSelectRegisterEncryptedPrivateKey(): string | null {
  return useSelector<IRootState, string | null>(
    (state) => state.register.encryptedPrivateKey
  );
}
