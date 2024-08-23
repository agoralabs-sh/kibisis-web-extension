import BigNumber from 'bignumber.js';

// types
import type { INativeCurrency } from '@extension/types';

interface IProps {
  atomicBalance: BigNumber;
  minAtomicBalance: BigNumber;
  nativeCurrency: INativeCurrency;
}

export default IProps;
