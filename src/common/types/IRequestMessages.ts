// messages
import {
  EnableRequestMessage,
  SignBytesRequestMessage,
  SignTxnsRequestMessage,
} from '../messages';

type IRequestMessages =
  | EnableRequestMessage
  | SignBytesRequestMessage
  | SignTxnsRequestMessage;

export default IRequestMessages;
