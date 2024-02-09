// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface INewBaseContractOptions extends IBaseOptions {
  network: INetwork;
}

export default INewBaseContractOptions;
