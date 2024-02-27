// types
import type { IARC0200Asset, INetwork } from '@extension/types';

interface IUpdateAccountInformationAndAssetHoldingsActionOptions {
  address: string;
  arc0200Assets: IARC0200Asset[];
  network: INetwork;
}

export default IUpdateAccountInformationAndAssetHoldingsActionOptions;
