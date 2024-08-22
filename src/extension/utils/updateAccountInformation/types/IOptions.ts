// types
import type { IBaseOptions } from '@common/types';
import type { IAccountInformation, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  address: string;
  currentAccountInformation: IAccountInformation;
  delay?: number;
  forceUpdate?: boolean;
  network: INetwork;
  nodeID: string | null;
}

export default IOptions;
