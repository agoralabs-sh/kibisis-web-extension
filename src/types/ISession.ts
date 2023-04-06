/**
 * @property {string} appName - the name of the dApp.
 * @property {string[]} authorizedAddresses - a list of authorized addresses.
 * @property {number} createdAt - a timestamp (in milliseconds) for when this session was created.
 * @property {string} genesisHash - the network genesis hash used in this session.
 * @property {string} genesisId - the network genesis ID used in this session.
 * @property {string} host - the domain name for dApp.
 * @property {string} id - a unique identifier for this session as a UUID v4.
 * @property {number} usedAt - a timestamp (in milliseconds) for when this session was last used.
 */
interface ISession {
  appName: string;
  authorizedAddresses: string[];
  createdAt: number;
  genesisHash: string;
  genesisId: string;
  host: string;
  id: string;
  usedAt: number;
}

export default ISession;
