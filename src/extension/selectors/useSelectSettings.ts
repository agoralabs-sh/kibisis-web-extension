import { useSelector } from 'react-redux';

// Features
import { filterSettingsFromState } from '@extension/features/settings';

// Types
import { IMainRootState, ISettings } from '@extension/types';

export default function useSelectSettings(): ISettings {
  return useSelector<IMainRootState, ISettings>((state) =>
    filterSettingsFromState(state.settings)
  );
}
