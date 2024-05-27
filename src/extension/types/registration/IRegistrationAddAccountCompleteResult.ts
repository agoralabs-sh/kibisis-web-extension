// types
import type { IAddAccountCompleteResult } from '../accounts';
import type { IARC0200Asset } from '../assets';

interface IRegistrationAddAccountCompleteResult
  extends IAddAccountCompleteResult {
  arc0200Assets: IARC0200Asset[];
}

export default IRegistrationAddAccountCompleteResult;
