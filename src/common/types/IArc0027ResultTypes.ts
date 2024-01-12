// types
import IArc0027EnableResult from './IArc0027EnableResult';
import IArc0027GetProvidersResult from './IArc0027GetProvidersResult';
import IArc0027SignBytesResult from './IArc0027SignBytesResult';
import IArc0027SignTxnsResult from './IArc0027SignTxnsResult';

type IArc0027ResultTypes =
  | IArc0027EnableResult
  | IArc0027GetProvidersResult
  | IArc0027SignBytesResult
  | IArc0027SignTxnsResult;

export default IArc0027ResultTypes;
