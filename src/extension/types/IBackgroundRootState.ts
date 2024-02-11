// features
import { IAccountsState } from '@extension/features/accounts';
import { IARC0200AssetsState } from '@extension/features/arc200-assets';
import { IEventsState } from '@extension/features/events';
import { INetworksState } from '@extension/features/networks';
import { ISessionsState } from '@extension/features/sessions';
import { ISettingsState } from '@extension/features/settings';
import { IStandardAssetsState } from '@extension/features/standard-assets';

// types
import IBaseRootState from './IBaseRootState';

interface IBackgroundRootState extends IBaseRootState {
  accounts: IAccountsState;
  arc200Assets: IARC0200AssetsState;
  events: IEventsState;
  networks: INetworksState;
  sessions: ISessionsState;
  settings: ISettingsState;
  standardAssets: IStandardAssetsState;
}

export default IBackgroundRootState;
