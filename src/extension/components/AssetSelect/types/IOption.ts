import { IAssetTypes, INativeCurrency } from '@extension/types';

interface IOption {
  value: IAssetTypes | INativeCurrency;
}

export default IOption;
