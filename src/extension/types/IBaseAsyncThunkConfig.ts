// types
import type IMainRootState from './IMainRootState';
import type IRegistrationRootState from './IRegistrationRootState';

interface IBaseAsyncThunkConfig<
  State = IMainRootState | IRegistrationRootState
> {
  state: State;
}

export default IBaseAsyncThunkConfig;
