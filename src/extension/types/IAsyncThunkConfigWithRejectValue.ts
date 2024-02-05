// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type IBaseAsyncThunkConfig from './IBaseAsyncThunkConfig';

interface IAsyncThunkConfigWithRejectValue<RejectValue = BaseExtensionError>
  extends IBaseAsyncThunkConfig {
  rejectValue?: RejectValue;
}

export default IAsyncThunkConfigWithRejectValue;
