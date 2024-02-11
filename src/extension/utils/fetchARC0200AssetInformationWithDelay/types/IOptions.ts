// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  network: INetwork;
  delay: number;
  id: string;
}

export default IOptions;
