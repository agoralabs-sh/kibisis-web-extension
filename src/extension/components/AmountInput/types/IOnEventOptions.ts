// types
import type { IAssetTypes, INativeCurrency } from '@extension/types';

interface IOnEventOptions {
  asset: IAssetTypes | INativeCurrency | null;
  maximumAmountInAtomicUnits: string;
}

export default IOnEventOptions;
