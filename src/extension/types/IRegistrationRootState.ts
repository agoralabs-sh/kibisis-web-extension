// features
import type { INetworksState } from '@extension/features/networks';
import type { INotificationsState } from '@extension/features/notifications';
import type { IRegistrationState } from '@extension/features/registration';
import type { ISettingsState } from '@extension/features/settings';
import type { ISystemState } from '@extension/features/system';

// types
import type IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  networks: INetworksState;
  notifications: INotificationsState;
  registration: IRegistrationState;
  settings: ISettingsState;
  system: ISystemState;
}

export default IRegistrationRootState;
