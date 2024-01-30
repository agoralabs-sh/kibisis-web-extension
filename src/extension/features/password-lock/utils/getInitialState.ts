// types
import { IPasswordLockState } from '../types';

export default function getInitialState(): IPasswordLockState {
  return {
    password: null,
    saving: false,
  };
}
