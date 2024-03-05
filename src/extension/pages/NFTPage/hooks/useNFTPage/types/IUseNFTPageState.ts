// types
import type {
  IAccount,
  IAccountInformation,
  IARC0072Asset,
  IARC0072AssetHolding,
} from '@extension/types';

interface IUseNFTPageState {
  account: IAccount | null;
  accountInformation: IAccountInformation | null;
  asset: IARC0072Asset | null;
  assetHolding: IARC0072AssetHolding | null;
}

export default IUseNFTPageState;
