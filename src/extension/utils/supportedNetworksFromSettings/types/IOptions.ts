// types
import type { INetwork, ISettings } from '@extension/types';

interface IOptions<T extends INetwork> {
  networks: T[];
  settings: ISettings;
}

export default IOptions;
