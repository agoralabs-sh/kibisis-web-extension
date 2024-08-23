import type { ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';
import type { ReactElement } from 'react';

interface IProps {
  color?: ResponsiveValue<CSS.Property.Color>;
  children: ReactElement;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  isOpen: boolean;
  label?: string;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  onChange: (open: boolean) => void;
}

export default IProps;
