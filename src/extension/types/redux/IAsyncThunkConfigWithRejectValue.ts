// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type IBaseAsyncThunkConfig from './IBaseAsyncThunkConfig';
import type IBaseRootState from '../states/IBaseRootState';

interface IAsyncThunkConfigWithRejectValue<
  State extends IBaseRootState,
  RejectValue = BaseExtensionError
> extends IBaseAsyncThunkConfig<State> {
  rejectValue?: RejectValue;
}

export default IAsyncThunkConfigWithRejectValue;
