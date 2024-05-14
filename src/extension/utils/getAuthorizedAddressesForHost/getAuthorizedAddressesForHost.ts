// types
import type { ISession } from '@extension/types';

/**
 * Filters the sessions by host and extracts the unique addresses.
 * @param {string} host - the host to check.
 * @param {ISession[]} sessions - a list of sessions to check from.
 * @returns {string[]} a list of host's authorized addresses from the supplied sessions.
 */
export default function getAuthorizedAddressesForHost(
  host: string,
  sessions: ISession[]
): string[] {
  return sessions
    .filter((value) => value.host === host)
    .reduce<string[]>(
      (acc, session) => [
        ...acc,
        ...session.authorizedAddresses.filter(
          (address) => !acc.some((value) => address === value)
        ), // get only unique addresses
      ],
      []
    );
}
