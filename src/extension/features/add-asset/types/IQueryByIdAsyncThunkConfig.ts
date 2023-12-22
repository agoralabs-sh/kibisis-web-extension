// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IBaseAsyncThunkConfig } from '@extension/types';

interface IQueryByIdAsyncThunkConfig extends IBaseAsyncThunkConfig {
  rejectValue?: BaseExtensionError;
}

export default IQueryByIdAsyncThunkConfig;
