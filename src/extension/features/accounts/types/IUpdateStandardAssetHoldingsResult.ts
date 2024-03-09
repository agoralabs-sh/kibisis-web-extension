// types
import type IUpdateAssetHoldingsResult from './IUpdateAssetHoldingsResult';

interface IUpdateStandardAssetHoldingsResult
  extends IUpdateAssetHoldingsResult {
  transactionId: string;
}

export default IUpdateStandardAssetHoldingsResult;
