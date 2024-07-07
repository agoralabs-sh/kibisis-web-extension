// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    addPasskey: null,
    fetching: false,
    passkey: null,
    saving: false,
  };
}
