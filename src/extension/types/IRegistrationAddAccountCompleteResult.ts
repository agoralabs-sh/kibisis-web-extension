// types
import type { IARC0200Asset } from './assets';
import IAddAccountCompleteResult from './IAddAccountCompleteResult';

interface IRegistrationAddAccountCompleteResult
  extends IAddAccountCompleteResult {
  arc0200Assets: IARC0200Asset[];
}

export default IRegistrationAddAccountCompleteResult;
