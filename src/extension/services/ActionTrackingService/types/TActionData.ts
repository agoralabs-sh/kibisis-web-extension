// types
import type IAcquireARC0072ActionData from './IAcquireARC0072ActionData';
import type IAddARC0200AssetActionData from './IAddARC0200AssetActionData';
import type IAddStandardAssetActionData from './IAddStandardAssetActionData';
import type IImportAccountViaQRCodeActionData from './IImportAccountViaQRCodeActionData';
import type ISendARC0200AssetActionData from './ISendARC0200AssetActionData';
import type ISendNativeCurrencyActionData from './ISendNativeCurrencyActionData';
import type ISendStandardAssetActionData from './ISendStandardAssetActionData';
import type ISignMessageActionData from './ISignMessageActionData';

type TActionData =
  | IAcquireARC0072ActionData
  | IAddARC0200AssetActionData
  | IAddStandardAssetActionData
  | IImportAccountViaQRCodeActionData
  | ISendARC0200AssetActionData
  | ISendNativeCurrencyActionData
  | ISendStandardAssetActionData
  | ISignMessageActionData;

export default TActionData;
