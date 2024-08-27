// types
import type {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
} from '@extension/types';

/**
 * @property {IAssetTypes | INativeCurrency | null} asset - the asset that is being sent.
 * @property {boolean} confirming - confirming the transaction to the network.
 * @property {boolean} creating - true, when building the transactions.
 * @property {IAccountWithExtendedProps | null} sender - the account where this is eing sent from.
 */
interface IState {
  asset: IAssetTypes | INativeCurrency | null;
  confirming: boolean;
  creating: boolean;
  sender: IAccountWithExtendedProps | null;
}

export default IState;
