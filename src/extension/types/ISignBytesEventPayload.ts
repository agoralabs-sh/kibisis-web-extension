// types
import {
  IBaseRequestPayload,
  IBaseSignBytesRequestPayload,
} from '@common/types';

type ISignBytesEventPayload = IBaseRequestPayload &
  IBaseSignBytesRequestPayload & {
    authorizedAddresses: string[];
  };

export default ISignBytesEventPayload;
