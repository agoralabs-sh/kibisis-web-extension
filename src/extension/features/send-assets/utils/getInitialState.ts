// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    asset: null,
    confirming: false,
    creating: false,
    sender: null,
  };
}
