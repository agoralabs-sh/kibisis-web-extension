// types
import type { INetwork, ISettings } from '@extension/types';

interface IOptions<T extends INetwork> {
  networks: T[];
  settings: ISettings;
  withDefaultFallback?: boolean;
}

export default IOptions;
