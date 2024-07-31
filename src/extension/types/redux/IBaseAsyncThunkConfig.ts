// types
import type IBaseRootState from '../states/IBaseRootState';

interface IBaseAsyncThunkConfig<State extends IBaseRootState> {
  state: State;
}

export default IBaseAsyncThunkConfig;
