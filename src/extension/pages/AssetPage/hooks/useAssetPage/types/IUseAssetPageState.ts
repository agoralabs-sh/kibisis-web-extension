import BigNumber from 'bignumber.js';

// types
import type {
  IAccountWithExtendedProps,
  IAccountInformation,
  IAssetTypes,
  IARC0200AssetHolding,
  IStandardAssetHolding,
} from '@extension/types';

interface IUseAssetPageState {
  account: IAccountWithExtendedProps | null;
  accountInformation: IAccountInformation | null;
  amountInStandardUnits: BigNumber;
  asset: IAssetTypes | null;
  assetHolding: IARC0200AssetHolding | IStandardAssetHolding | null;
}

export default IUseAssetPageState;
