/**
 * @property {boolean} importAccountViaQRCodeModalOpen - toggles the state of the import account via QR code modal.
 * @property {string | null} password - the password to use to secure accounts.
 * @property {saving} saving - whether the credentials are being saved or not.
 * @property {number} score - the score of the password.
 */
interface IState {
  importAccountViaQRCodeModalOpen: boolean;
  password: string | null;
  saving: boolean;
  score: number;
}

export default IState;
