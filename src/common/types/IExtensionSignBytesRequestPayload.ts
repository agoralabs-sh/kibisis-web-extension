// Types
import IBaseSignBytesRequestPayload from './IBaseSignBytesRequestPayload';

/**
 * @property {string} appName - the name of the dApp. This is extracted from the "application-name" of the documents
 * meta tag or, if this does not exist, the contents document title tag is used.
 * @property {string} host - used in the identity of the dApp. This is taken from the host of the dApp.
 * @property {string | null} iconUrl - the icon of the dApp. This is extracted from the dApp's favicon.
 */
interface IExtensionSignBytesRequestPayload
  extends IBaseSignBytesRequestPayload {
  appName: string;
  host: string;
  iconUrl: string | null;
}

export default IExtensionSignBytesRequestPayload;
