// types
import type IAccount from './IAccount';

/**
 * @property {boolean} watchAccount - determines if the account is a watch account.
 */
interface IAccountWithExtendedProps extends IAccount {
  watchAccount: boolean;
}

export default IAccountWithExtendedProps;
