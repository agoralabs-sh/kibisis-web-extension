// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  IActiveAccountDetails,
} from '@extension/types';
import type IAccountUpdateRequest from './IAccountUpdateRequest';

/**
 * @property {IActiveAccountDetails | null} activeAccountDetails - details of the active account.
 * @property {boolean} fetching - true when fetching accounts from storage.
 * @property {IAccountGroup[]} groups - All account groups.
 * @property {IAccount[]} items - All accounts.
 * @property {number | null} pollingId - id of the polling interval.
 * @property {boolean} saving - true when the account is being saved to storage.
 * @property {IAccountUpdateRequest[]} updateRequests - a list of account update events being updated.
 */
interface IState {
  activeAccountDetails: IActiveAccountDetails | null;
  fetching: boolean;
  groups: IAccountGroup[];
  items: IAccountWithExtendedProps[];
  pollingId: number | null;
  saving: boolean;
  updateRequests: IAccountUpdateRequest[];
}

export default IState;
