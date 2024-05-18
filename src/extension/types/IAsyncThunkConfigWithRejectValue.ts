// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type IBaseAsyncThunkConfig from './IBaseAsyncThunkConfig';
import type IMainRootState from './states/IMainRootState';
import type IRegistrationRootState from './states/IRegistrationRootState';

interface IAsyncThunkConfigWithRejectValue<
  State = IMainRootState | IRegistrationRootState,
  RejectValue = BaseExtensionError
> extends IBaseAsyncThunkConfig<State> {
  rejectValue?: RejectValue;
}

export default IAsyncThunkConfigWithRejectValue;
