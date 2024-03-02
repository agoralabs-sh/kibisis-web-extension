// types
import IAddAccountCompleteResult from './IAddAccountCompleteResult';

interface IProps {
  onComplete: (result: IAddAccountCompleteResult) => Promise<void>;
  saving: boolean;
}

export default IProps;
