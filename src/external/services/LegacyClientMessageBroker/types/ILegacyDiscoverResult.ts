import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';

// types
import type INetworkConfigurationWithLegacyMethods from './INetworkConfigurationWithLegacyMethods';

interface ILegacyDiscoverResult extends IDiscoverResult {
  networks: INetworkConfigurationWithLegacyMethods[];
}

export default ILegacyDiscoverResult;
