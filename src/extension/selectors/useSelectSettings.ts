import { useSelector } from 'react-redux';

// features
import { filterSettingsFromState } from '@extension/features/settings';

// types
import { IMainRootState, ISettings } from '@extension/types';

export default function useSelectSettings(): ISettings {
  return useSelector<IMainRootState, ISettings>((state) =>
    filterSettingsFromState(state.settings)
  );
}
