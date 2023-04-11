// Types
import { ISession } from '@extension/types';

/**
 * Updates the session, if it exists, otherwise it adds the session and returns the updated sessions list. This function
 * uses the id as the index.
 * @param {ISession[]} sessions - a list of sessions.
 * @param {ISession} session - the session to add or update.
 * @returns {IAccount[]} a new sessions list with the session updated or added.
 */
export default function upsertSession(
  sessions: ISession[],
  session: ISession
): ISession[] {
  // if the accounts doesn't contain the account by address, just add it
  if (!sessions.find((value) => value.id === session.id)) {
    return [...sessions, session];
  }

  return sessions.map((value) => (value.id === session.id ? session : value));
}
