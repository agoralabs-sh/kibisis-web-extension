/**
 * @property {boolean} updateAccountInformation - [optional] instruct the thunk to dispatch an action to also update
 * account information.
 */
interface IFetchAccountsPayload {
  updateAccountInformation?: boolean;
}

export default IFetchAccountsPayload;
