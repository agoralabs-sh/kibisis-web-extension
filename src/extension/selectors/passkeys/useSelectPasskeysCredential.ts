import { useSelector } from 'react-redux';

// types
import type {
  IBackgroundRootState,
  IMainRootState,
  IPasskeyCredential,
} from '@extension/types';

export default function useSelectPasskeysCredential(): IPasskeyCredential | null {
  return useSelector<
    IBackgroundRootState | IMainRootState,
    IPasskeyCredential | null
  >((state) => state.passkeys.credential);
}
