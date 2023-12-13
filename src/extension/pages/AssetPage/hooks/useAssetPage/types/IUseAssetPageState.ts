import BigNumber from 'bignumber.js';

// types
import {
  IAccount,
  IAccountInformation,
  IStandardAsset,
  IStandardAssetHolding,
} from '@extension/types';

interface IUseAssetPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  asset: IStandardAsset | null;
  assetHolding: IStandardAssetHolding | null;
  standardUnitAmount: BigNumber;
}

export default IUseAssetPageState;
