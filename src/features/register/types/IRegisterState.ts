interface IRegisterState {
  encryptedPrivateKey: string | null;
  encrypting: boolean;
  password: string | null;
  saving: boolean;
  score: number;
}

export default IRegisterState;
