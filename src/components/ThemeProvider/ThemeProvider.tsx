import { ChakraProvider, ColorMode } from '@chakra-ui/react';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

// Selectors
import { useSelectSettings } from '../../selectors';

// Services
import { ColorModeManager } from '../../services/extension';

// Theme
import { theme } from '../../theme';

// Types
import { ISettings } from '../../types';

// Utils
import { setDocumentColorMode } from './utils';

interface IProps extends PropsWithChildren {
  initialColorMode: ColorMode;
}

const ThemeProvider: FC<IProps> = ({ children, initialColorMode }) => {
  const settings: ISettings = useSelectSettings();
  const [colorModeManager] = useState<ColorModeManager>(
    new ColorModeManager(initialColorMode)
  );
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);

  useEffect(() => {
    if (settings.appearance) {
      colorModeManager.set(settings.appearance.theme);

      if (settings.appearance.theme !== colorMode) {
        setDocumentColorMode(settings.appearance.theme);
        setColorMode(settings.appearance.theme);
      }
    }
  }, [settings]);

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
