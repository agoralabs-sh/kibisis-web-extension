// messages
import {
  EnableResponseMessage,
  SignBytesResponseMessage,
  SignTxnsResponseMessage,
} from '../messages';

type IResponseMessages =
  | EnableResponseMessage
  | SignBytesResponseMessage
  | SignTxnsResponseMessage;

export default IResponseMessages;
