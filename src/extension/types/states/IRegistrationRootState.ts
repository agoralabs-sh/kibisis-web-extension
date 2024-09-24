// features
import type { IState as INotificationsState } from '@extension/features/notifications';
import type { IState as RegistrationState } from '@extension/features/registration';

// types
import type IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  notifications: INotificationsState;
  registration: RegistrationState;
}

export default IRegistrationRootState;
