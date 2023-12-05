/**
 * @property {string[]} accountIds - [optional] a list of account IDs to update. If this is omitted, all accounts are
 * updated.
 * @property {string} forceUpdate - [optional] forces an account information update regardless of the updatedAt date.
 */
interface IUpdateAccountInformationPayload {
  accountIds?: string[];
  forceUpdate?: boolean;
}

export default IUpdateAccountInformationPayload;
