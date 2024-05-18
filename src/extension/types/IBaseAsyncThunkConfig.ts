// types
import type IMainRootState from './states/IMainRootState';
import type IRegistrationRootState from './states/IRegistrationRootState';

interface IBaseAsyncThunkConfig<
  State = IMainRootState | IRegistrationRootState
> {
  state: State;
}

export default IBaseAsyncThunkConfig;
