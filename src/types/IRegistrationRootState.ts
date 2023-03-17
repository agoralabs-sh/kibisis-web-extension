// Features
import { IRegisterState } from '../features/register';

// Types
import IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  register: IRegisterState;
}

export default IRegistrationRootState;
