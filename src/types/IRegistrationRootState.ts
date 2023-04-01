// Features
import { ISettingsState } from '../features/settings';
import { IRegistrationState } from '../features/registration';

// Types
import IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  settings: ISettingsState;
  registration: IRegistrationState;
}

export default IRegistrationRootState;
