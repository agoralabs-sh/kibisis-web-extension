import { IAssetTypes, INativeCurrency } from '@extension/types';

interface IInitializeSendAssetPayload {
  fromAddress: string | null;
  selectedAsset: IAssetTypes | INativeCurrency;
}

export default IInitializeSendAssetPayload;
