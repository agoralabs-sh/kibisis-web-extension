// types
import type { IStandardAsset } from '@extension/types';
import type IUpdateAssetHoldingsPayload from './IUpdateAssetHoldingsPayload';

interface IUpdateStandardAssetHoldingsPayload
  extends IUpdateAssetHoldingsPayload<IStandardAsset> {
  password: string;
}

export default IUpdateStandardAssetHoldingsPayload;
