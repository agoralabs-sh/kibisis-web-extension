import { ISignTxnsOptions } from '@agoralabs-sh/algorand-provider';

/**
 * @property {string | null} description - a description of the dApp. This is extracted from the "description" meta tag.
 * @property {string} host - used in the identity of the dApp. This is taken from the host of the dApp.
 */
interface IExtensionSignTxnsRequestPayload extends ISignTxnsOptions {
  host: string;
}

export default IExtensionSignTxnsRequestPayload;
