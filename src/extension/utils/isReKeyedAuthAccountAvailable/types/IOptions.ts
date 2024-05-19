// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IOptions {
  accounts: IAccountWithExtendedProps[];
  authAddress: string;
}

export default IOptions;
