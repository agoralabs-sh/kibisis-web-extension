// types
import { IEventsState } from '../types';

export default function getInitialState(): IEventsState {
  return {
    enableRequest: null,
    signBytesRequest: null,
    signTxnsRequest: null,
  };
}
