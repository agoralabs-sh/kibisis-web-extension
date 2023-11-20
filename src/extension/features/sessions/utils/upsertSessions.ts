// types
import { ISession } from '@extension/types';

/**
 * Updates the sessions, if any exist, otherwise it adds the sessions and returns the updated sessions list. This
 * function uses the id as the index.
 * @param {ISession[]} sessions - a list of sessions.
 * @param {ISession[]} upsertSessions - the sessions to add or update.
 * @returns {ISession[]} a new sessions list with the sessions updated or added.
 */
export default function upsertSessions(
  sessions: ISession[],
  upsertSessions: ISession[]
): ISession[] {
  const sessionsToAdd: ISession[] = upsertSessions.filter(
    (session) => !sessions.some((value) => value.id === session.id)
  );
  const updatedSessions: ISession[] = sessions.map(
    (session) =>
      upsertSessions.find((value) => value.id === session.id) || session
  ); // update the sessions

  return [...updatedSessions, ...sessionsToAdd];
}
