// types
import { ARC0300EncodingEnum, ARC0300QueryEnum } from '@extension/enums';

interface IARC0300AccountImportQuery {
  [ARC0300QueryEnum.Asset]: string[];
  [ARC0300QueryEnum.Encoding]: ARC0300EncodingEnum;
  [ARC0300QueryEnum.PrivateKey]: string;
}

export default IARC0300AccountImportQuery;
