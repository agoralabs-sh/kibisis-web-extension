import { ResponsiveValue, StackProps } from '@chakra-ui/react';
import * as CSS from 'csstype';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren<StackProps> {
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  label: string;
}

export default IProps;
