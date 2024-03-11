// types
import type IUpdateAssetHoldingsResult from './IUpdateAssetHoldingsResult';

interface IUpdateStandardAssetHoldingsResult
  extends IUpdateAssetHoldingsResult {
  transactionIds: string[];
}

export default IUpdateStandardAssetHoldingsResult;
