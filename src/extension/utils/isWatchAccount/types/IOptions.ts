// types
import type { IAccount } from '@extension/types';
import type { IBaseOptions } from '@common/types';

interface IOptions extends IBaseOptions {
  account: IAccount;
}

export default IOptions;
