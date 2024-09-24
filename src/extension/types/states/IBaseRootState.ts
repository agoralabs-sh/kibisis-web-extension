// features
import type { IState as ILayoutState } from '@extension/features/layout';
import type { IState as INetworksState } from '@extension/features/networks';
import type { IState as ISettingsState } from '@extension/features/settings';
import type { IState as ISystemState } from '@extension/features/system';

interface IBaseRootState {
  layout: ILayoutState;
  networks: INetworksState;
  settings: ISettingsState;
  system: ISystemState;
}

export default IBaseRootState;
