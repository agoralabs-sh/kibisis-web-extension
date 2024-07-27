/**
 * @property {number} credentialLockTimeoutDuration - the duration, in milliseconds, for when the credential lock alarm
 * is fired.
 * @property {boolean} enableCredentialLock - whether the credential lock is enabled.
 */
interface ISecuritySettings {
  credentialLockTimeoutDuration: number;
  enableCredentialLock: boolean;
}

export default ISecuritySettings;
