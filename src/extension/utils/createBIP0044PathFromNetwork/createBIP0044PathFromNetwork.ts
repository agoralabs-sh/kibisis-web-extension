// constants
import { BIP0044_PURPOSE } from '@extension/constants';

// types
import type { IOptions } from './types';

export default function createBIP0044PathFromNetwork({
  accountIndex,
  network,
}: IOptions): string {
  return `${BIP0044_PURPOSE}'/${network.hdWalletCoinType}'/${accountIndex}'/0/0`;
}
