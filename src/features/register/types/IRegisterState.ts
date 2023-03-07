/**
 * @property {string | null} encryptedPrivateKey - the encrypted private key of the account to register with.
 * @property {boolean} encrypting - whether the private key is being encrypting or not.
 * @property {string | null} name - a nickname for this account.
 * @property {string | null} password - the password to use to secure accounts.
 * @property {saving} saving - whether the credentials are being saved or not.
 * @property {number} score - the score of the password.
 */
interface IRegisterState {
  encryptedPrivateKey: string | null;
  encrypting: boolean;
  name: string | null;
  password: string | null;
  saving: boolean;
  score: number;
}

export default IRegisterState;
