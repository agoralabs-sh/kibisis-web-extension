// enums
import { ActionNameEnum } from '../enums';

// types
import type TActionData from './TActionData';

interface IAction<Data = TActionData> {
  data: Data;
  hostname: string;
  language: string;
  name: ActionNameEnum;
  website: string;
}

export default IAction;
