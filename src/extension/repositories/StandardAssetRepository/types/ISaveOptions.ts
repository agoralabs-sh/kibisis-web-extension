// types
import type { IStandardAsset } from '@extension/types';

interface ISaveOptions {
  genesisHash: string;
  items: IStandardAsset[];
}

export default ISaveOptions;
