// types
import type { IAccountUpdateRequest } from '@extension/features/accounts';

interface IOptions {
  accountID: string;
  requestID: string;
  updateRequests: IAccountUpdateRequest[];
}

export default IOptions;
