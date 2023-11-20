// features
import { INetworksState } from '../features/networks';
import { ISettingsState } from '../features/settings';
import { IRegistrationState } from '../features/registration';

// types
import IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  networks: INetworksState;
  settings: ISettingsState;
  registration: IRegistrationState;
}

export default IRegistrationRootState;
