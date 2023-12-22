// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IMainRootState } from '@extension/types';

interface IQueryByIdAsyncThunkConfig {
  state: IMainRootState;
  rejectValue?: BaseExtensionError;
}

export default IQueryByIdAsyncThunkConfig;
