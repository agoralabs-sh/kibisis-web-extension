import { ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';

// types
import type {
  IAccountWithExtendedProps,
  INetwork,
  ITransactions,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  isOpen: boolean;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  onChange: (open: boolean) => void;
  transaction: ITransactions;
}

export default IProps;
