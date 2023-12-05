/**
 * @property {string[]} accountIds - [optional] a list of account IDs to update. If this is omitted, all accounts are
 * updated.
 * @property {boolean} refresh - [optional] if it is a refresh, the account transactions will be refreshed.
 */
interface IUpdateAccountTransactionsPayload {
  accountIds?: string[];
  refresh?: boolean;
}

export default IUpdateAccountTransactionsPayload;
