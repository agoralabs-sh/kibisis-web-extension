// types
import type { INetwork } from '@extension/types';

interface IUseUpdateStandardAssetsOptions {
  assetIDs: string[];
  network: INetwork | null;
}

export default IUseUpdateStandardAssetsOptions;
