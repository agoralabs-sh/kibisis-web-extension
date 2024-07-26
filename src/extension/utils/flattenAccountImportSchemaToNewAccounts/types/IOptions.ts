// types
import type { IBaseOptions } from '@common/types';
import type {
  IAccountWithExtendedProps,
  IARC0300AccountImportSchema,
} from '@extension/types';

interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  schemas: IARC0300AccountImportSchema[];
}

export default IOptions;
