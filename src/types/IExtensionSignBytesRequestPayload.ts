import { IBaseSignBytesRequestPayload } from './index';

/**
 * @property {string} host - used in the identity of the dapp.
 */
interface IExtensionSignBytesRequestPayload
  extends IBaseSignBytesRequestPayload {
  host: string;
}

export default IExtensionSignBytesRequestPayload;
