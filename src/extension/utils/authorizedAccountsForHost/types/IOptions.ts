// types
import type { IAccountWithExtendedProps, ISession } from '@extension/types';

interface IOptions {
  accounts: IAccountWithExtendedProps[];
  host: string;
  sessions: ISession[];
}

export default IOptions;
