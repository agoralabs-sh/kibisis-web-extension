// types
import IAddAccountCompleteResult from './IAddAccountCompleteResult';
import IARC0200Asset from './IARC0200Asset';

interface IRegistrationAddAccountCompleteResult
  extends IAddAccountCompleteResult {
  arc0200Assets: IARC0200Asset[];
}

export default IRegistrationAddAccountCompleteResult;
