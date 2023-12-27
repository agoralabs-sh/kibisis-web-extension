import { IArc200Asset, IStandardAsset } from '@extension/types';

interface IInitializeSendAssetPayload {
  fromAddress: string | null;
  selectedAsset: IArc200Asset | IStandardAsset;
}

export default IInitializeSendAssetPayload;
