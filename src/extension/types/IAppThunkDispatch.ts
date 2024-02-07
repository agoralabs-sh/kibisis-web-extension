import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// types
import type IMainRootState from './IMainRootState';
import type IRegistrationRootState from './IRegistrationRootState';

type IAppThunkDispatch<State = IMainRootState | IRegistrationRootState> =
  ThunkDispatch<State, unknown, AnyAction>;

export default IAppThunkDispatch;
