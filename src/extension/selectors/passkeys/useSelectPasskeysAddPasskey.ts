import { useSelector } from 'react-redux';

// types
import type {
  IBackgroundRootState,
  IMainRootState,
  IPasskeyCredential,
} from '@extension/types';

export default function useSelectPasskeysAddPasskey(): IPasskeyCredential | null {
  return useSelector<
    IBackgroundRootState | IMainRootState,
    IPasskeyCredential | null
  >((state) => state.passkeys.addPasskey);
}
