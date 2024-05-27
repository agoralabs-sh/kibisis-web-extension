// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type TReKeyType from './TReKeyType';

interface ISetAccountAndActionPayload {
  account: IAccountWithExtendedProps;
  type: TReKeyType;
}

export default ISetAccountAndActionPayload;
