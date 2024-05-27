import { ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';

// types
import type {
  IAccountWithExtendedProps,
  INetwork,
  ITransactions,
} from '@extension/types';

interface IItemProps<Transaction = ITransactions> {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  transaction: Transaction;
}

export default IItemProps;
