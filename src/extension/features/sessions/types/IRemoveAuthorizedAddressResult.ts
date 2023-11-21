// types
import { ISession } from '@extension/types';

/**
 * @property {string[]} remove - a list of session IDs to remove.
 * @property {ISession[]} update - a list sessions to update.
 */
interface IRemoveAuthorizedAddressResult {
  remove: string[];
  update: ISession[];
}

export default IRemoveAuthorizedAddressResult;
