interface IRegisterState {
  encryptedPrivateKey: string | null;
  encrypting: boolean;
  password: string | null;
  saving: boolean;
}

export default IRegisterState;
