/**
 * @property {string[]} authorizedAccountIds - a list of authorized account ids.
 * @property {number} createdAt - a timestamp (in seconds) for when this session was created.
 * @property {string} host - the domain name for dApp.
 * @property {string} id - a unique identifier for this session as a UUID v4.
 * @property {string} name - the name of the dApp.
 * @property {number} usedAt - a timestamp (in seconds) for when this session was last used.
 */
interface ISession {
  authorizedAccountIds: string[];
  createdAt: number;
  host: string;
  id: string;
  name: string;
  usedAt: number;
}

export default ISession;
