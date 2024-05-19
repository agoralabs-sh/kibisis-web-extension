// types
import type IAccountInformation from './IAccountInformation';

/**
 * @property {boolean} watchAccount - determines if the account is a watch account.
 */
interface IAccountInformationWithExtendedProps extends IAccountInformation {
  watchAccount: boolean;
}

export default IAccountInformationWithExtendedProps;
