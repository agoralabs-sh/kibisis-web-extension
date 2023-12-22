import { IStandardAsset } from '@extension/types';

interface IInitializeSendAssetPayload {
  fromAddress: string | null;
  selectedAsset: IStandardAsset;
}

export default IInitializeSendAssetPayload;
