/**
 * @property {string[]} accountIDs - a list of account IDs to update.
 * @property {boolean} forceInformationUpdate - [optional] forces an account information update regardless of the
 * updatedAt date. Defaults to false.
 * @property {boolean} informationOnly - [optional] only updates the account information. Defaults to true.
 * @property {boolean} refreshTransactions - [optional] fetches the latest transactions as opposed to older
 * transactions. Defaults to false.
 */
interface IUpdateAccountsPayload {
  accountIDs: string[];
  forceInformationUpdate?: boolean;
  informationOnly?: boolean;
  refreshTransactions?: boolean;
}

export default IUpdateAccountsPayload;
