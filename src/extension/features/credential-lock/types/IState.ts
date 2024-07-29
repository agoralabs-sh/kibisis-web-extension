// enums
import { CredentialLockActivationStateEnum } from '@extension/enums';

/**
 * @property {CredentialLockActivationStateEnum | null} activated - whether the credential lock is activated or not. If
 * the value is null, the credential lock has not been enabled.
 * @property {boolean} saving - whether the credential lock is being saved or not.
 */
interface IState {
  activated: CredentialLockActivationStateEnum | null;
  saving: boolean;
}

export default IState;
