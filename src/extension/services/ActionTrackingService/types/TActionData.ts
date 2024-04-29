// types
import type ISendARC0200AssetActionData from './ISendARC0200AssetActionData';
import type ISendNativeCurrencyActionData from './ISendNativeCurrencyActionData';
import type ISendStandardAssetActionData from './ISendStandardAssetActionData';

type TActionData =
  | ISendNativeCurrencyActionData
  | ISendARC0200AssetActionData
  | ISendStandardAssetActionData;

export default TActionData;
