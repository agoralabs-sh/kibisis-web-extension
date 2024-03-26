// types
import IARC0027DisableResult from './IARC0027DisableResult';
import IARC0027EnableResult from './IARC0027EnableResult';
import IARC0027GetProvidersResult from './IARC0027GetProvidersResult';
import IARC0027SignBytesResult from './IARC0027SignBytesResult';
import IARC0027SignTxnsResult from './IARC0027SignTxnsResult';

type IARC0027ResultTypes =
  | IARC0027DisableResult
  | IARC0027EnableResult
  | IARC0027GetProvidersResult
  | IARC0027SignBytesResult
  | IARC0027SignTxnsResult;

export default IARC0027ResultTypes;
