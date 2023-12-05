// types
import IBaseActionMeta from './IBaseActionMeta';

interface IRejectedActionMeta extends IBaseActionMeta<'rejected'> {
  aborted: boolean;
  condition: boolean;
  rejectedWithValue: boolean;
}

export default IRejectedActionMeta;
