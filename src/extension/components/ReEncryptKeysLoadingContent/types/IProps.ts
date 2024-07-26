import type { ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';

// types
import type IEncryptionState from './IEncryptionState';

interface IProps {
  encryptionProgressState: IEncryptionState[];
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
}

export default IProps;
