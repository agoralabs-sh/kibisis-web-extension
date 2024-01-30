/**
 * @property {string | null} password - the password to use to secure accounts.
 * @property {saving} saving - whether the password lock is being saved or not.
 */
interface IPasswordLockState {
  password: string | null;
  saving: boolean;
}

export default IPasswordLockState;
