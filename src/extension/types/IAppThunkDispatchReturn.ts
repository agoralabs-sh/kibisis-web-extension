// types
import {
  AsyncThunkFulfilledActionCreator,
  AsyncThunkRejectedActionCreator,
} from '@reduxjs/toolkit/dist/createAsyncThunk';

type IAppThunkDispatchReturn<Config, Result> = Promise<
  | ReturnType<AsyncThunkFulfilledActionCreator<Result, string>>
  | ReturnType<AsyncThunkRejectedActionCreator<string, Config>>
> & {
  abort: (reason?: string) => void;
  requestId: string;
  arg: string;
  unwrap: () => Promise<Result>;
};

export default IAppThunkDispatchReturn;
