// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  address: string;
  appId: string;
  network: INetwork;
  delay: number;
}

export default IOptions;
