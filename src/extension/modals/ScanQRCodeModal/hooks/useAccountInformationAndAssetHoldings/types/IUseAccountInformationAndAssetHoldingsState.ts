// types
import type { IAccountInformation, IARC0200Asset } from '@extension/types';
import IUpdateAccountInformationAndAssetHoldingsActionOptions from './IUpdateAccountInformationAndAssetHoldingsActionOptions';

interface IUseAccountInformationAndAssetHoldingsState {
  accountInformation: IAccountInformation | null;
  loading: boolean;
  updateAccountInformationAndAssetHoldingsAction: (
    options: IUpdateAccountInformationAndAssetHoldingsActionOptions
  ) => Promise<void>;
}

export default IUseAccountInformationAndAssetHoldingsState;
