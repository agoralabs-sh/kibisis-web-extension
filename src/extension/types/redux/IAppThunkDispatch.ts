import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// types
import type IBaseRootState from '../states/IBaseRootState';

type IAppThunkDispatch<State extends IBaseRootState> = ThunkDispatch<
  State,
  unknown,
  AnyAction
>;

export default IAppThunkDispatch;
