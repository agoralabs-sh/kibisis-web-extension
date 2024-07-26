// types
import type INewAccount from '../accounts/INewAccount';

interface IProps {
  onComplete: (account: INewAccount) => Promise<void>;
  saving: boolean;
}

export default IProps;
