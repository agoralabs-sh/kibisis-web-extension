import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// types
import IMainRootState from './IMainRootState';

type IAppThunkDispatch = ThunkDispatch<IMainRootState, unknown, AnyAction>;

export default IAppThunkDispatch;
