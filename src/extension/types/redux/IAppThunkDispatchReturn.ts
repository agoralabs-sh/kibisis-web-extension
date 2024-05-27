import type {
  AsyncThunkFulfilledActionCreator,
  AsyncThunkRejectedActionCreator,
} from '@reduxjs/toolkit/dist/createAsyncThunk';

type IAppThunkDispatchReturn<Arg, Config, Result> = Promise<
  | ReturnType<AsyncThunkFulfilledActionCreator<Result, Arg, Config>>
  | ReturnType<AsyncThunkRejectedActionCreator<Arg, Config>>
> & {
  abort: (reason?: string) => void;
  requestId: string;
  arg: Arg;
  unwrap: () => Promise<Result>;
};

export default IAppThunkDispatchReturn;
