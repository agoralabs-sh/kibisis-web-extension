// enums
import { ARC0300EncodingEnum } from '@extension/enums';

interface IOptions {
  assets: string[];
  encoding?: ARC0300EncodingEnum;
  privateKey: Uint8Array;
}

export default IOptions;
