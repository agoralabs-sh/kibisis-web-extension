// types
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

interface IOptions {
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
}

export default IOptions;
