import { useSelector } from 'react-redux';
import { ColorMode } from '@chakra-ui/react';

// Types
import { IAppearanceSettings, IMainRootState } from '@extension/types';

export default function useSelectColorMode(): ColorMode {
  const appearanceSettings: IAppearanceSettings = useSelector<
    IMainRootState,
    IAppearanceSettings
  >((state) => state.settings.appearance);

  return appearanceSettings.theme;
}
