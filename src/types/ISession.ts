/**
 * @property {string} appName - the name of the dApp.
 * @property {string[]} authorizedAddresses - a list of authorized addresses.
 * @property {number} createdAt - a timestamp (in milliseconds) for when this session was created.
 * @property {string | null} description - the description of the application.
 * @property {string} genesisHash - the network genesis hash used in this session.
 * @property {string} genesisId - the network genesis ID used in this session.
 * @property {string} host - the domain name for dApp.
 * @property {string | null} iconUrl - an icon url for the app.
 * @property {string} id - a unique identifier for this session as a UUID v4.
 * @property {number} usedAt - a timestamp (in milliseconds) for when this session was last used.
 */
interface ISession {
  appName: string;
  authorizedAddresses: string[];
  createdAt: number;
  description: string | null;
  genesisHash: string;
  genesisId: string;
  host: string;
  iconUrl: string | null;
  id: string;
  usedAt: number;
}

export default ISession;
