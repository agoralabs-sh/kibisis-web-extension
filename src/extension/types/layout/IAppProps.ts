import type { ColorMode } from '@chakra-ui/react';
import type * as CSS from 'csstype';
import type { i18n } from 'i18next';

interface IAppProps {
  i18n: i18n;
  initialColorMode: ColorMode;
  initialFontFamily: CSS.Property.FontFamily;
}

export default IAppProps;
