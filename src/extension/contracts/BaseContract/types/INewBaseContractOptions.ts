import BigNumber from 'bignumber.js';

// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface INewBaseContractOptions extends IBaseOptions {
  appId: BigNumber;
  network: INetwork;
}

export default INewBaseContractOptions;
