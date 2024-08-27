/**
 * @property {boolean} importAccountViaQRCodeModalOpen - toggles the state of the import account via QR code modal.
 * @property {string | null} password - the password to use to secure accounts.
 * @property {saving} saving - whether the credentials are being saved or not.
 */
interface IState {
  importAccountViaQRCodeModalOpen: boolean;
  password: string | null;
  saving: boolean;
}

export default IState;
