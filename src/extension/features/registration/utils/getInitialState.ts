// types
import type { IRegistrationState } from '../types';

export default function getInitialState(): IRegistrationState {
  return {
    importAccountViaQRCodeModalOpen: false,
    password: null,
    saving: false,
    score: -1,
  };
}
