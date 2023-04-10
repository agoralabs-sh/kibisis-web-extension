/**
 * @property {string | null} password - the password to use to secure accounts.
 * @property {saving} saving - whether the credentials are being saved or not.
 * @property {number} score - the score of the password.
 */
interface IRegistrationState {
  password: string | null;
  saving: boolean;
  score: number;
}

export default IRegistrationState;
