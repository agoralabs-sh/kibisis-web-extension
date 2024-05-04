import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';

// types
import type IUseWalletNetworkConfiguration from './IUseWalletNetworkConfiguration';

interface ILegacyDiscoverResult extends IDiscoverResult {
  networks: IUseWalletNetworkConfiguration[];
}

export default ILegacyDiscoverResult;
