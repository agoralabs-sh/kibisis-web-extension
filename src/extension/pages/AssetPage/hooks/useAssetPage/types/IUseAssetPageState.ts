import BigNumber from 'bignumber.js';

// types
import {
  IAccount,
  IAccountInformation,
  IAssetTypes,
  IArc200AssetHolding,
  IStandardAssetHolding,
} from '@extension/types';

interface IUseAssetPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  amountInStandardUnits: BigNumber;
  asset: IAssetTypes | null;
  assetHolding: IArc200AssetHolding | IStandardAssetHolding | null;
}

export default IUseAssetPageState;
