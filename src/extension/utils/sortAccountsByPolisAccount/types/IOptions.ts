// types
import type { IAccount } from '@extension/types';

interface IOptions<Type extends IAccount> {
  accounts: Type[];
  polisAccountID: string;
}

export default IOptions;
