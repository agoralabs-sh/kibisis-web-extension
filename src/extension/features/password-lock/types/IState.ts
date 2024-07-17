// types
import type { TEncryptionCredentials } from '@extension/types';

/**
 * @property {TEncryptionCredentials | null} credentials - the password or the passkey used to secure accounts.
 * @property {saving} saving - whether the password lock is being saved or not.
 */
interface IState {
  credentials: TEncryptionCredentials | null;
  saving: boolean;
}

export default IState;
