import { IAsset } from '@extension/types';

interface IInitializeSendAssetPayload {
  fromAddress: string | null;
  selectedAsset: IAsset;
}

export default IInitializeSendAssetPayload;
