// Types
import { IRegisterState } from '../types';

export default function getInitialState(): IRegisterState {
  return {
    encryptedPrivateKey: null,
    encrypting: false,
    password: null,
    saving: false,
  };
}
