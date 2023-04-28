/**
 * @property {boolean} updateAccountInformation - [optional] instruct the thunk to dispatch an action to also update
 * account information.
 */
interface IFetchAccountsFromStoragePayload {
  updateAccountInformation?: boolean;
}

export default IFetchAccountsFromStoragePayload;
