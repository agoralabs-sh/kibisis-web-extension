import { ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface IProps {
  color?: string;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  text: string;
}

export default IProps;
