// types
import type { IAccountInformation, TSignMessageAction } from '../../../types';

interface IProps {
  account: IAccountInformation | null;
  signMessageAction: TSignMessageAction;
}

export default IProps;
