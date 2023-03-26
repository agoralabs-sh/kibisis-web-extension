// Types
import { IRegistrationState } from '../types';

export default function getInitialState(): IRegistrationState {
  return {
    encryptedPrivateKey: null,
    encrypting: false,
    name: null,
    password: null,
    saving: false,
    score: -1,
  };
}
