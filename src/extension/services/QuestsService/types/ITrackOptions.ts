// enums
import { QuestNameEnum } from '../enums';

// types
import type TQuestData from './TQuestData';

interface ITrackOptions {
  account: string;
  data?: TQuestData;
  name: QuestNameEnum;
}

export default ITrackOptions;
