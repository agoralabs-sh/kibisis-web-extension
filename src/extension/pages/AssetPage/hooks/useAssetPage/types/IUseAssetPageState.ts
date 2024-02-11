import BigNumber from 'bignumber.js';

// types
import {
  IAccount,
  IAccountInformation,
  IAssetTypes,
  IARC0200AssetHolding,
  IStandardAssetHolding,
} from '@extension/types';

interface IUseAssetPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  amountInStandardUnits: BigNumber;
  asset: IAssetTypes | null;
  assetHolding: IARC0200AssetHolding | IStandardAssetHolding | null;
}

export default IUseAssetPageState;
