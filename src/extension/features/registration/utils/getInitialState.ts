// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    importAccountViaQRCodeModalOpen: false,
    password: null,
    saving: false,
  };
}
