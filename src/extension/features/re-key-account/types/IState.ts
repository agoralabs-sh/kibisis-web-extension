// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type TReKeyType from './TReKeyType';

interface IState {
  account: IAccountWithExtendedProps | null;
  confirming: boolean;
  type: TReKeyType | null;
}

export default IState;
