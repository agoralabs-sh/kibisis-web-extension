// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    enableRequest: null,
    signMessageRequest: null,
    signTransactionsRequest: null,
  };
}
