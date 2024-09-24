// types
import type { INetwork } from '@extension/types';

interface ICreateOptions {
  accountIndex: number;
  network: INetwork;
  publicKey: Uint8Array;
}

export default ICreateOptions;
