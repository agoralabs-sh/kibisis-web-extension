// types
import { AppTypeEnum } from '@extension/enums';

interface ICreateWindowOptions {
  left?: number;
  searchParams?: URLSearchParams;
  top?: number;
  type: AppTypeEnum;
}

export default ICreateWindowOptions;
