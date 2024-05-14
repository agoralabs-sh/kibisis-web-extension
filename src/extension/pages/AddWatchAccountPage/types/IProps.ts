// types
import type IAddWatchAccountCompleteResult from './IAddWatchAccountCompleteResult';

interface IProps {
  onComplete: (result: IAddWatchAccountCompleteResult) => Promise<void>;
  saving: boolean;
}

export default IProps;
