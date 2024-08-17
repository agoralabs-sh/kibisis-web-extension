// types
import type { INetwork, ISettings } from '@extension/types';

interface IOptions {
  genesisHash: string;
  networks: INetwork[];
  settings: ISettings;
}

export default IOptions;
