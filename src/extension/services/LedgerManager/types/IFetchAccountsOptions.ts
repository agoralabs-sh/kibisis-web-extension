// types
import type { INetwork } from '@extension/types';
import type { IBaseOptions } from '@common/types';

interface IFetchAccountsOptions extends IBaseOptions {
  network: INetwork;
  start?: number;
}

export default IFetchAccountsOptions;
