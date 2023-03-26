// Features
import { IRegistrationState } from '../features/registration';

// Types
import IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  registration: IRegistrationState;
}

export default IRegistrationRootState;
