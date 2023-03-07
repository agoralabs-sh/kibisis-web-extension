// Features
import { IApplicationState } from '../features/application';
import { IRegisterState } from '../features/register';

interface IRootState {
  application: IApplicationState;
  register: IRegisterState;
}

export default IRootState;
