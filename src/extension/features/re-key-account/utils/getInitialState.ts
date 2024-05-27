// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    account: null,
    confirming: false,
    type: null,
  };
}
