// types
import type IBaseActionMeta from './IBaseActionMeta';

interface IRejectedActionMeta<Arg> extends IBaseActionMeta<Arg, 'rejected'> {
  aborted: boolean;
  condition: boolean;
  rejectedWithValue: boolean;
}

export default IRejectedActionMeta;
