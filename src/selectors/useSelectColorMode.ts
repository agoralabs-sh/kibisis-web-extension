import { useSelector } from 'react-redux';

// Types
import { IAppearanceSettings, IMainRootState } from '../types';
import { ColorMode } from '@chakra-ui/react';

export default function useSelectColorMode(): ColorMode {
  const appearanceSettings: IAppearanceSettings = useSelector<
    IMainRootState,
    IAppearanceSettings
  >((state) => state.settings.appearance);

  return appearanceSettings.theme;
}
