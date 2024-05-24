// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IState {
  account: IAccountWithExtendedProps | null;
  confirming: boolean;
}

export default IState;
