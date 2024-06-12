// types
import type IAcquireARC0072QuestData from './IAcquireARC0072QuestData';
import type IAddARC0200AssetQuestData from './IAddARC0200AssetQuestData';
import type IAddStandardAssetQuestData from './IAddStandardAssetQuestData';
import type IImportAccountViaQRCodeQuestData from './IImportAccountViaQRCodeQuestData';
import type ISendARC0200AssetQuestData from './ISendARC0200AssetQuestData';
import type ISendNativeCurrencyQuestData from './ISendNativeCurrencyQuestData';
import type ISendStandardAssetQuestData from './ISendStandardAssetQuestData';
import type ISignMessageQuestData from './ISignMessageQuestData';

type TQuestData =
  | IAcquireARC0072QuestData
  | IAddARC0200AssetQuestData
  | IAddStandardAssetQuestData
  | IImportAccountViaQRCodeQuestData
  | ISendARC0200AssetQuestData
  | ISendNativeCurrencyQuestData
  | ISendStandardAssetQuestData
  | ISignMessageQuestData;

export default TQuestData;
