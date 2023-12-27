import BigNumber from 'bignumber.js';

// types
import {
  IAccount,
  IAccountInformation,
  IArc200Asset,
  IArc200AssetHolding,
  IStandardAsset,
  IStandardAssetHolding,
} from '@extension/types';

interface IUseAssetPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  amountInStandardUnits: BigNumber;
  asset: IArc200Asset | IStandardAsset | null;
  assetHolding: IArc200AssetHolding | IStandardAssetHolding | null;
}

export default IUseAssetPageState;
