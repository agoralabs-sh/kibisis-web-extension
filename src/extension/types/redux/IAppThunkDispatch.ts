import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// types
import type IMainRootState from '../states/IMainRootState';
import type IRegistrationRootState from '../states/IRegistrationRootState';

type IAppThunkDispatch<State = IMainRootState | IRegistrationRootState> =
  ThunkDispatch<State, unknown, AnyAction>;

export default IAppThunkDispatch;
