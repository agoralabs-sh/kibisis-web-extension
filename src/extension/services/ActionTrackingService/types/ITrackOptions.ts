// enums
import { ActionNameEnum } from '../enums';

// types
import type TActionData from './TActionData';

interface ITrackOptions {
  account: string;
  data?: TActionData;
  name: ActionNameEnum;
}

export default ITrackOptions;
