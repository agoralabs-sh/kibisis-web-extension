import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// Types
import IRootState from './IRootState';

type IAppThunkDispatch = ThunkDispatch<IRootState, unknown, AnyAction>;

export default IAppThunkDispatch;
