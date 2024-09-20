// types
import type { IARC0072Asset } from '@extension/types';

interface ISaveOptions {
  genesisHash: string;
  items: IARC0072Asset[];
}

export default ISaveOptions;
