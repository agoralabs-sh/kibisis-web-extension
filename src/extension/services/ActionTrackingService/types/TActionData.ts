// types
import type IImportAccountViaQRCodeActionData from './IImportAccountViaQRCodeActionData';
import type ISendARC0200AssetActionData from './ISendARC0200AssetActionData';
import type ISendNativeCurrencyActionData from './ISendNativeCurrencyActionData';
import type ISendStandardAssetActionData from './ISendStandardAssetActionData';

type TActionData =
  | IImportAccountViaQRCodeActionData
  | ISendARC0200AssetActionData
  | ISendNativeCurrencyActionData
  | ISendStandardAssetActionData;

export default TActionData;
