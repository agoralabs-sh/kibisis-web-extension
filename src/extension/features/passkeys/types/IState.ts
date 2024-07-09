// types
import type { IPasskeyCredential } from '@extension/types';

/**
 * @property {boolean} fetching - whether the credential is being fetched.
 * @property {IPasskeyCredential | null} passkey - the stored passkey credential.
 * @property {boolean} saving - whether the credential is being saved.
 */
interface IState {
  fetching: boolean;
  passkey: IPasskeyCredential | null;
  saving: boolean;
}

export default IState;
