import { useSelector } from 'react-redux';

// enums
import { CredentialLockActivationStateEnum } from '@extension/enums';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

export default function useSelectCredentialLockActivated(): CredentialLockActivationStateEnum | null {
  return useSelector<
    IBackgroundRootState | IMainRootState,
    CredentialLockActivationStateEnum | null
  >((state) => state.credentialLock.activated);
}
