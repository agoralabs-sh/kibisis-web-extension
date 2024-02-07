// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type IBaseAsyncThunkConfig from './IBaseAsyncThunkConfig';
import type IMainRootState from './IMainRootState';
import type IRegistrationRootState from './IRegistrationRootState';

interface IAsyncThunkConfigWithRejectValue<
  State = IMainRootState | IRegistrationRootState,
  RejectValue = BaseExtensionError
> extends IBaseAsyncThunkConfig<State> {
  rejectValue?: RejectValue;
}

export default IAsyncThunkConfigWithRejectValue;
