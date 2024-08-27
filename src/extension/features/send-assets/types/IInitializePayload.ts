// types
import type {
  IAccountWithExtendedProps,
  IAssetTypes,
  INativeCurrency,
} from '@extension/types';

interface IInitializePayload {
  sender: IAccountWithExtendedProps;
  asset: IAssetTypes | INativeCurrency;
}

export default IInitializePayload;
