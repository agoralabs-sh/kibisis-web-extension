import BigNumber from 'bignumber.js';

// types
import {
  IAccount,
  IAccountInformation,
  IAsset,
  IAssetHolding,
} from '@extension/types';

interface IUseAssetPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  asset: IAsset | null;
  assetHolding: IAssetHolding | null;
  standardUnitAmount: BigNumber;
}

export default IUseAssetPageState;
