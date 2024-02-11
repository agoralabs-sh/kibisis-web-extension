import { StackProps } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';

interface IProps extends StackProps {
  amountInAtomicUnits: BigNumber;
  decimals: number;
  displayUnit?: boolean;
  icon: ReactNode;
  isLoading?: boolean;
  label: string;
  unit?: string;
  warningLabel?: string;
}

export default IProps;
