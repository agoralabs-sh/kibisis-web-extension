/**
 * @property {string} accountId - the account to update.
 * @property {boolean} refresh - [optional] if it is a refresh, the accounts are refreshed.
 */
interface IUpdateAccountTransactionsForAccountPayload {
  accountId: string;
  refresh?: boolean;
}

export default IUpdateAccountTransactionsForAccountPayload;
