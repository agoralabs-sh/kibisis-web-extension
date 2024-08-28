import { ChakraProvider, type ColorMode } from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { type FC, useEffect, useState } from 'react';

// selectors
import { useSelectSettings } from '@extension/selectors';

// services
import ColorModeManager from '@extension/services/ColorModeManager';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

// utils
import { setDocumentColorMode } from './utils';

const ThemeProvider: FC<IProps> = ({
  children,
  initialColorMode,
  initialFontFamily,
}) => {
  // selectors
  const settings = useSelectSettings();
  // states
  const [colorModeManager] = useState<ColorModeManager>(
    new ColorModeManager(initialColorMode)
  );
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);
  const [font, setFont] = useState<CSS.Property.FontFamily>(initialFontFamily);

  useEffect(() => {
    if (settings.appearance) {
      colorModeManager.set(settings.appearance.theme);

      // if the color has updated in the settings, change it
      if (settings.appearance.theme !== colorMode) {
        setDocumentColorMode(settings.appearance.theme);
        setColorMode(settings.appearance.theme);
      }

      // if the font has changed in the settings, change it
      if (settings.appearance.font !== font) {
        setFont(settings.appearance.font);
      }
    }
  }, [settings]);

  return (
    <ChakraProvider
      colorModeManager={colorModeManager}
      theme={{
        ...theme,
        fonts: {
          body: font,
          heading: font,
        },
      }}
    >
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
