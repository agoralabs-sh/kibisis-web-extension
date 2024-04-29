// enums
import { ActionNameEnum } from '../enums';

// types
import type { INetwork } from '@extension/types';
import type TActionData from './TActionData';

interface ITrackOptions {
  data: TActionData;
  name: ActionNameEnum;
  network: INetwork;
}

export default ITrackOptions;
