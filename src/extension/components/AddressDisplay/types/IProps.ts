// types
import type { IAccount, INetwork, TSizes } from '@extension/types';

interface IProps {
  accounts: IAccount[];
  address: string;
  ariaLabel?: string;
  colorScheme?: string;
  network: INetwork;
  size?: TSizes;
}

export default IProps;
