import { useSelector } from 'react-redux';

// Features
import { filterSettingsFromState } from '../features/settings';

// Types
import { IMainRootState, ISettings } from '../types';

export default function useSelectSettings(): ISettings {
  return useSelector<IMainRootState, ISettings>((state) =>
    filterSettingsFromState(state.settings)
  );
}
