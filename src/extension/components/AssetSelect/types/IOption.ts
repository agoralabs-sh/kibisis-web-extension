import { IArc200Asset, IStandardAsset } from '@extension/types';

interface IOption {
  asset: IArc200Asset | IStandardAsset;
  value: string;
}

export default IOption;
