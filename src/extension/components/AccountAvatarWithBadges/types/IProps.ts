// types
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
}

export default IProps;
