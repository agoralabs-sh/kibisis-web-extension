// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

interface IQueryByIdAsyncThunkConfig
  extends IBaseAsyncThunkConfig<IMainRootState> {
  rejectValue?: BaseExtensionError;
}

export default IQueryByIdAsyncThunkConfig;
