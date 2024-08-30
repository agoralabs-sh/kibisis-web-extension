import type { ColorMode } from '@chakra-ui/react';
import * as CSS from 'csstype';
import type { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  initialColorMode: ColorMode;
  initialFontFamily: CSS.Property.FontFamily;
}

export default IProps;
