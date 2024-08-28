import { ColorMode } from '@chakra-ui/react';
import * as CSS from 'csstype';
import { i18n } from 'i18next';

interface IAppProps {
  i18next: i18n;
  initialColorMode: ColorMode;
  initialFontFamily: CSS.Property.FontFamily;
}

export default IAppProps;
