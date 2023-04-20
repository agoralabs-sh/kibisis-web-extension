// Types
import { IMessagesState } from '../types';

export default function getInitialState(): IMessagesState {
  return {
    enableRequest: null,
    signBytesRequest: null,
    signTxnsRequest: null,
  };
}
