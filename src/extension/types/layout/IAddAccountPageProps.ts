// types
import type IAddAccountCompleteResult from '../accounts/IAddAccountCompleteResult';

interface IProps {
  onComplete: (result: IAddAccountCompleteResult) => Promise<void>;
  saving: boolean;
}

export default IProps;
