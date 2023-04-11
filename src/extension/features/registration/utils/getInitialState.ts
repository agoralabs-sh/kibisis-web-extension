// Types
import { IRegistrationState } from '../types';

export default function getInitialState(): IRegistrationState {
  return {
    password: null,
    saving: false,
    score: -1,
  };
}
