// types
import IArc0013EnableResult from './IArc0013EnableResult';
import IArc0013GetProvidersResult from './IArc0013GetProvidersResult';
import IArc0013SignBytesResult from './IArc0013SignBytesResult';
import IArc0013SignTxnsResult from './IArc0013SignTxnsResult';

type IArc0013ResultTypes =
  | IArc0013EnableResult
  | IArc0013GetProvidersResult
  | IArc0013SignBytesResult
  | IArc0013SignTxnsResult;

export default IArc0013ResultTypes;
