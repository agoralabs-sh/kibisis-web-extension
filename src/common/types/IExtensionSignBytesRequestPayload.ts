import { IBaseSignBytesRequestPayload } from './index';

/**
 * @property {string} host - used in the identity of the dapp.
 */
interface IExtensionSignBytesRequestPayload
  extends IBaseSignBytesRequestPayload {
  appName: string;
  host: string;
  iconUrl: string | null;
}

export default IExtensionSignBytesRequestPayload;
