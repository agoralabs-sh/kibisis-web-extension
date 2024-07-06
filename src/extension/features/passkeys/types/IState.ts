// types
import type { IPasskeyCredential } from '@extension/types';

/**
 * @property {boolean} fetching - whether the credential is being fetched.
 * @property {IPasskeyCredential | null} credential - the passkey credential.
 * @property {boolean} saving - whether the credential is being saved.
 */
interface IState {
  fetching: boolean;
  credential: IPasskeyCredential | null;
  saving: boolean;
}

export default IState;
